<?php
/**
 * Gerenciador Avançado de Doações, Rastreabilidade e Auditoria Antifraude
 *
 * @package   MyAAC
 */

defined('MYAAC') or die('Direct access not allowed!');

$title = 'Gerenciador de Doações & Rastreabilidade Antifraude';

if (function_exists('ensure_donation_audit_tables')) {
    ensure_donation_audit_tables();
}

// Processar Ações (Aprovar / Estornar em Cadeia / Cancelar)
if (isset($_GET['action']) && isset($_GET['id'])) {
    $order_id = (int)$_GET['id'];
    $act = $_GET['action'];

    $order = $db->query("SELECT * FROM `myaac_donations` WHERE `id` = " . $order_id)->fetch();
    if ($order) {
        if ($act === 'approve') {
            // Intenção: Aprovar pedido e creditar dias de Premium com registro no livro razão
            $premium_days = 0;
            if (function_exists('get_donation_premium_days')) {
                $premium_days = get_donation_premium_days($order);
            }
            if ($premium_days <= 0) {
                $premium_days = 90;
            }
            $db->query("UPDATE `myaac_donations` SET `status` = 'completed', `updated_at` = " . time() . " WHERE `id` = " . $order_id);
            if (function_exists('credit_premium_account')) {
                credit_premium_account((int)$order['account_id'], $premium_days, $order_id, 'Aprovação Manual via Painel Administrativo');
            }
            
            if (function_exists('log_donation_event')) {
                log_donation_event($order_id, $order['account_id'], 'MANUAL_APPROVAL', 'Pedido #' . $order_id . ' aprovado manualmente no Admin - ' . $premium_days . ' dias Premium creditados');
            }
            
            echo '<div class="alert alert-success"><strong>Sucesso!</strong> Pedido #' . $order_id . ' aprovado. ' . (int)$premium_days . ' dias de Premium Account foram creditados na conta ID ' . (int)$order['account_id'] . '.</div>';
        } elseif ($act === 'revert_chargeback') {
            // Intenção: Acionar estorno e punição em cadeia
            if (function_exists('revert_fraudulent_donation')) {
                revert_fraudulent_donation($order_id, 'Estorno Solicitado Manualmente via Painel Admin');
            }
            echo '<div class="alert alert-danger"><strong>Estorno Executado!</strong> O pedido #' . $order_id . ' foi estornado. Os dias de Premium vinculados foram removidos e a conta foi banida permanentemente.</div>';
        } elseif ($act === 'cancel') {
            $db->query("UPDATE `myaac_donations` SET `status` = 'canceled', `updated_at` = " . time() . " WHERE `id` = " . $order_id);
            if (function_exists('log_donation_event')) {
                log_donation_event($order_id, $order['account_id'], 'ORDER_CANCELED', 'Pedido #' . $order_id . ' marcado como cancelado no Admin');
            }
            echo '<div class="alert alert-warning">Pedido #' . $order_id . ' foi marcado como Cancelado.</div>';
        }
    }
}

// Filtro de Busca
$search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
$where_clause = '';
if (!empty($search_query)) {
    $sq = $db->quote('%' . $search_query . '%');
    $sq_int = (int)$search_query;
    $where_clause = " WHERE `account_name` LIKE {$sq} OR `id` = {$sq_int} OR `account_id` = {$sq_int} OR `payer_ip` LIKE {$sq} OR `mp_payment_id` LIKE {$sq} ";
}

// Intenção: Calcular equivalência financeira em R$ para pacotes pagos em Tibia Coins
if (!function_exists('get_tc_package_equivalent_brl')) {
    function get_tc_package_equivalent_brl($don) {
        $days = function_exists('get_donation_premium_days') ? get_donation_premium_days($don) : 90;
        $pkg_id = isset($don['points_package']) ? (int)$don['points_package'] : 3;

        if ($days >= 360 || $pkg_id === 12 || $pkg_id === 360) {
            return array('tc' => 10000, 'brl' => 1621.00, 'name' => 'PA 12 Meses (360 Dias)');
        } elseif ($days >= 180 || $pkg_id === 6 || $pkg_id === 180) {
            return array('tc' => 6000, 'brl' => 872.00, 'name' => 'PA 6 Meses (180 Dias)');
        } else {
            return array('tc' => 3000, 'brl' => 468.00, 'name' => 'PA 3 Meses (90 Dias)');
        }
    }
}

// Cálculo das Estatísticas Financeiras & Balancete Mensal
$all_donations = $db->query("SELECT * FROM `myaac_donations` ORDER BY `id` DESC")->fetchAll();

// 1. Dinheiro Real em Caixa (FIAT: PIX + Cartão)
$fiat_approved_val = 0.0;
$fiat_estornado_val = 0.0;
$count_fiat_completed = 0;
$count_fiat_chargedback = 0;

// 2. Conta Patrimonial Tibia Coins (TC + Equivalente R$)
$tc_total_coins = 0;
$tc_equivalent_brl = 0.0;
$count_tc_completed = 0;

$count_pending = 0;

$stats_method = array(
    'pix' => array('val' => 0.0, 'days' => 0, 'count' => 0),
    'stripe' => array('val' => 0.0, 'days' => 0, 'count' => 0, 'brands' => array(), 'installments' => array()),
    'tibia_coins' => array('days' => 0, 'coins' => 0, 'eq_brl' => 0.0, 'count' => 0)
);

// Intenção: Estruturar o Balancete Financeiro Mensal (DRE da Empresa)
$monthly_balance = array();

if (!empty($all_donations)) {
    foreach ($all_donations as $d) {
        $price_clean = (float)str_replace(array('R$', ' ', '.'), array('', '', ''), str_replace(',', '.', $d['price']));
        $coins = (int)$d['coins'];
        $days_row = function_exists('get_donation_premium_days') ? (int)get_donation_premium_days($d) : $coins;
        if ($days_row <= 0 && $coins > 0 && $coins <= 360) {
            $days_row = $coins;
        }
        $m = $d['payment_method'];
        $created_time = isset($d['created_at']) && (int)$d['created_at'] > 0 ? (int)$d['created_at'] : time();
        $month_key = date('Y-m', $created_time);

        if (!isset($monthly_balance[$month_key])) {
            $monthly_balance[$month_key] = array(
                'label' => date('m/Y', $created_time),
                'pix_brl' => 0.0,
                'stripe_brl' => 0.0,
                'fiat_gross' => 0.0,
                'fiat_chargeback' => 0.0,
                'fiat_net' => 0.0,
                'tc_coins' => 0,
                'tc_equivalent_brl' => 0.0,
                'total_consolidated' => 0.0,
                'count_fiat_completed' => 0,
                'count_tc_completed' => 0,
                'count_chargedback' => 0
            );
        }

        if ($d['status'] === 'completed') {
            if ($m === 'pix') {
                $fiat_approved_val += $price_clean;
                $count_fiat_completed++;
                $stats_method['pix']['val'] += $price_clean;
                $stats_method['pix']['days'] += $days_row;
                $stats_method['pix']['count']++;

                $monthly_balance[$month_key]['pix_brl'] += $price_clean;
                $monthly_balance[$month_key]['fiat_gross'] += $price_clean;
                $monthly_balance[$month_key]['count_fiat_completed']++;

            } elseif ($m === 'stripe') {
                $fiat_approved_val += $price_clean;
                $count_fiat_completed++;
                $stats_method['stripe']['val'] += $price_clean;
                $stats_method['stripe']['days'] += $days_row;
                $stats_method['stripe']['count']++;

                $monthly_balance[$month_key]['stripe_brl'] += $price_clean;
                $monthly_balance[$month_key]['fiat_gross'] += $price_clean;
                $monthly_balance[$month_key]['count_fiat_completed']++;

                $b = !empty($d['card_brand']) ? strtoupper($d['card_brand']) : 'DESCONHECIDO';
                $inst = isset($d['installments']) && (int)$d['installments'] > 0 ? (int)$d['installments'] : 1;
                $stats_method['stripe']['brands'][$b] = isset($stats_method['stripe']['brands'][$b]) ? $stats_method['stripe']['brands'][$b] + 1 : 1;
                $stats_method['stripe']['installments'][$inst] = isset($stats_method['stripe']['installments'][$inst]) ? $stats_method['stripe']['installments'][$inst] + 1 : 1;

            } elseif ($m === 'tibia_coins') {
                // Cálculo proporcional do valor equivalente em R$ para Tibia Coins
                $tc_details = get_tc_package_equivalent_brl($d);
                $tc_coins_row = $tc_details['tc'];
                $tc_brl_row = $tc_details['brl'];

                $tc_total_coins += $tc_coins_row;
                $tc_equivalent_brl += $tc_brl_row;
                $count_tc_completed++;

                $stats_method['tibia_coins']['days'] += $days_row;
                $stats_method['tibia_coins']['coins'] += $tc_coins_row;
                $stats_method['tibia_coins']['eq_brl'] += $tc_brl_row;
                $stats_method['tibia_coins']['count']++;

                $monthly_balance[$month_key]['tc_coins'] += $tc_coins_row;
                $monthly_balance[$month_key]['tc_equivalent_brl'] += $tc_brl_row;
                $monthly_balance[$month_key]['count_tc_completed']++;
            }

        } elseif ($d['status'] === 'charged_back') {
            if ($m === 'pix' || $m === 'stripe') {
                $fiat_estornado_val += $price_clean;
                $count_fiat_chargedback++;

                $monthly_balance[$month_key]['fiat_chargeback'] += $price_clean;
                $monthly_balance[$month_key]['count_chargedback']++;
            }
        } elseif ($d['status'] === 'pending') {
            $count_pending++;
        }

        // Subtotais mensais
        $monthly_balance[$month_key]['fiat_net'] = max(0.0, $monthly_balance[$month_key]['fiat_gross'] - $monthly_balance[$month_key]['fiat_chargeback']);
        $monthly_balance[$month_key]['total_consolidated'] = $monthly_balance[$month_key]['fiat_net'] + $monthly_balance[$month_key]['tc_equivalent_brl'];
    }
    krsort($monthly_balance);
}

// Totais Consolidados Gerais
$fiat_net_val = max(0.0, $fiat_approved_val - $fiat_estornado_val);
$total_overall_patrimony = $fiat_net_val + $tc_equivalent_brl;

// Buscar Histórico Filtrado para a Tabela
$donations = $db->query("SELECT * FROM `myaac_donations` {$where_clause} ORDER BY `id` DESC LIMIT 100")->fetchAll();

// Buscar Logs de Auditoria
$logs = array();
if ($db->hasTable('myaac_donation_logs')) {
    $logs = $db->query("SELECT * FROM `myaac_donation_logs` ORDER BY `id` DESC LIMIT 30")->fetchAll();
}

// Buscar Registros de Rastreamento de Itens
$item_traces = array();
if ($db->hasTable('myaac_item_traces')) {
    $item_traces = $db->query("SELECT * FROM `myaac_item_traces` ORDER BY `id` DESC LIMIT 30")->fetchAll();
}
?>

<!-- 1. DASHBOARD CONSOLIDADO: DINHEIRO EM CAIXA VS TIBIA COINS VS PATRIMÔNIO GERAL -->
<div class="row" style="margin-bottom: 20px;">
    <div class="col-md-3">
        <div class="small-box bg-green" style="background-color: #27ae60 !important; color: #fff; padding: 15px; border-radius: 8px;">
            <div class="inner">
                <h3>R$ <?php echo number_format($fiat_approved_val, 2, ',', '.'); ?></h3>
                <p>Receita Bruta em Dinheiro (PIX + Cartão)</p>
            </div>
            <div class="icon" style="font-size: 30px; opacity: 0.3;"><i class="fa fa-money"></i></div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="small-box bg-red" style="background-color: #c0392b !important; color: #fff; padding: 15px; border-radius: 8px;">
            <div class="inner">
                <h3>R$ <?php echo number_format($fiat_estornado_val, 2, ',', '.'); ?></h3>
                <p>Estornos em Dinheiro Real (<?php echo $count_fiat_chargedback; ?>)</p>
            </div>
            <div class="icon" style="font-size: 30px; opacity: 0.3;"><i class="fa fa-ban"></i></div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="small-box bg-primary" style="background-color: #059669 !important; color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
            <div class="inner">
                <h3>R$ <?php echo number_format($fiat_net_val, 2, ',', '.'); ?></h3>
                <p><strong>Caixa Líquido em Dinheiro (R$)</strong></p>
            </div>
            <div class="icon" style="font-size: 30px; opacity: 0.3;"><i class="fa fa-wallet"></i></div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="small-box bg-purple" style="background-color: #7c3aed !important; color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);">
            <div class="inner">
                <h3>R$ <?php echo number_format($tc_equivalent_brl, 2, ',', '.'); ?></h3>
                <p><strong>🪙 Tibia Coins (Equiv. R$)</strong> (<?php echo number_format($tc_total_coins, 0, ',', '.'); ?> TC)</p>
            </div>
            <div class="icon" style="font-size: 30px; opacity: 0.3;"><i class="fa fa-coins"></i></div>
        </div>
    </div>
</div>

<!-- 1.1 RESUMO PATRIMONIAL CONSOLIDADO DA EMPRESA -->
<div class="alert alert-info" style="background-color: #f0f9ff !important; border: 1.5px solid #0284c7 !important; color: #0369a1 !important; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
            <h4 style="margin: 0 0 4px 0; font-weight: 700; color: #0284c7; font-size: 16px;">
                🏛️ Patrimônio Financeiro Geral Consolidado (Dinheiro + Tibia Coins)
            </h4>
            <span style="font-size: 13px; opacity: 0.9;">
                Caixa em Dinheiro Líquido (R$ <?php echo number_format($fiat_net_val, 2, ',', '.'); ?>) + Valor Proporcional em Tibia Coins (R$ <?php echo number_format($tc_equivalent_brl, 2, ',', '.'); ?>)
            </span>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0369a1;">Montante Total Avaliado</div>
            <div style="font-size: 24px; font-weight: 800; color: #0284c7;">R$ <?php echo number_format($total_overall_patrimony, 2, ',', '.'); ?></div>
        </div>
    </div>
</div>

<!-- 1.2 BALANCETE MENSAL MÊS A MÊS (DRE DE ARRECADAÇÃO COMPLETA) -->
<div class="box box-primary" style="margin-bottom: 20px; border-top: 3px solid #059669;">
    <div class="box-header with-border" style="display: flex; justify-content: space-between; align-items: center;">
        <h3 class="box-title" style="font-weight: 700;">📊 Balancete Financeiro Mensal (DRE Segregada: Dinheiro vs. Tibia Coins)</h3>
        <button onclick="window.print();" class="btn btn-sm btn-default" style="font-weight: 600;"><i class="fa fa-print"></i> Imprimir Balancete Oficial</button>
    </div>
    <div class="box-body table-responsive">
        <table class="table table-bordered table-striped text-center">
            <thead>
                <tr style="background-color: #f8fafc;">
                    <th>Mês / Ano</th>
                    <th>⚡ PIX (R$)</th>
                    <th>💳 Cartão (R$)</th>
                    <th>🚫 Estornos (R$)</th>
                    <th>💰 Caixa Líquido R$ (FIAT)</th>
                    <th>🪙 Tibia Coins (Qtd. & Eq. R$)</th>
                    <th>🌐 Total Consolidado R$</th>
                    <th>Pedidos Concluídos</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($monthly_balance)): ?>
                    <?php foreach ($monthly_balance as $mb): ?>
                    <tr>
                        <td><strong><?php echo htmlspecialchars($mb['label']); ?></strong></td>
                        <td class="text-success">R$ <?php echo number_format($mb['pix_brl'], 2, ',', '.'); ?></td>
                        <td class="text-info">R$ <?php echo number_format($mb['stripe_brl'], 2, ',', '.'); ?></td>
                        <td class="text-danger"><?php echo $mb['fiat_chargeback'] > 0 ? ('- R$ ' . number_format($mb['fiat_chargeback'], 2, ',', '.')) : 'R$ 0,00'; ?></td>
                        <td><strong style="color: #047857; font-size: 14px;">R$ <?php echo number_format($mb['fiat_net'], 2, ',', '.'); ?></strong></td>
                        <td style="color: #6d28d9; font-weight: 600;">
                            <?php echo number_format($mb['tc_coins'], 0, ',', '.'); ?> TC<br>
                            <small class="text-muted">(Eq. R$ <?php echo number_format($mb['tc_equivalent_brl'], 2, ',', '.'); ?>)</small>
                        </td>
                        <td><strong style="color: #0284c7; font-size: 15px;">R$ <?php echo number_format($mb['total_consolidated'], 2, ',', '.'); ?></strong></td>
                        <td>
                            <span class="label label-success"><?php echo $mb['count_fiat_completed']; ?> FIAT</span>
                            <span class="label label-primary" style="background-color: #7c3aed !important;"><?php echo $mb['count_tc_completed']; ?> TC</span>
                            <?php if ($mb['count_chargedback'] > 0): ?>
                                <span class="label label-danger"><?php echo $mb['count_chargedback']; ?> estornos</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="8" class="text-center text-muted">Nenhum dado financeiro registrado até o momento.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- 2. DETALHAMENTO POR MÉTODO DE PAGAMENTO -->
<div class="row" style="margin-bottom: 20px;">
    <div class="col-md-4">
        <div class="box box-success" style="border-top: 3px solid #27ae60;">
            <div class="box-header with-border"><h4 class="box-title">⚡ Pagamentos em PIX (Premium Account)</h4></div>
            <div class="box-body">
                <p><strong>Total Recebido:</strong> R$ <?php echo number_format($stats_method['pix']['val'], 2, ',', '.'); ?></p>
                <p><strong>Dias Premium Entregues:</strong> <?php echo number_format($stats_method['pix']['days'], 0, ',', '.'); ?> dias</p>
                <p><strong>Vendas Concluídas:</strong> <?php echo $stats_method['pix']['count']; ?> pedidos</p>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="box box-info" style="border-top: 3px solid #2980b9;">
            <div class="box-header with-border"><h4 class="box-title">💳 Cartão de Crédito (Premium Account)</h4></div>
            <div class="box-body">
                <p><strong>Total Recebido:</strong> R$ <?php echo number_format($stats_method['stripe']['val'], 2, ',', '.'); ?></p>
                <p><strong>Dias Premium Entregues:</strong> <?php echo number_format($stats_method['stripe']['days'], 0, ',', '.'); ?> dias</p>
                <p><strong>Vendas Concluídas:</strong> <?php echo $stats_method['stripe']['count']; ?> pedidos</p>
                <hr style="margin: 10px 0;">
                <small><strong>Parcelamento:</strong> 
                    <?php 
                    if (!empty($stats_method['stripe']['installments'])) {
                        $p_out = array();
                        ksort($stats_method['stripe']['installments']);
                        foreach ($stats_method['stripe']['installments'] as $k => $v) {
                            $p_out[] = "{$k}x ({$v})";
                        }
                        echo implode(', ', $p_out);
                    } else {
                        echo 'Nenhum registrado';
                    }
                    ?>
                </small>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="box box-warning" style="border-top: 3px solid #f39c12;">
            <div class="box-header with-border"><h4 class="box-title">🪙 Tibia Coins → Premium Account (3k / 6k / 10k TC)</h4></div>
            <div class="box-body">
                <p><strong>Dias Premium Entregues:</strong> <?php echo number_format($stats_method['tibia_coins']['days'], 0, ',', '.'); ?> dias</p>
                <p><strong>Vendas Concluídas:</strong> <?php echo $stats_method['tibia_coins']['count']; ?> pedidos</p>
                <p style="margin:0;"><small class="text-muted">PA 3 Meses = 3.000 TC • PA 6 Meses = 6.000 TC • PA 12 Meses = 10.000 TC</small></p>
            </div>
        </div>
    </div>
</div>

<!-- 3. BARRA DE BUSCA E FILTRO -->
<div class="box box-default" style="margin-bottom: 20px;">
    <div class="box-body">
        <form method="get" action="" class="form-inline">
            <input type="hidden" name="p" value="donations">
            <div class="form-group" style="width: 70%;">
                <input type="text" name="search" class="form-control" style="width: 100%;" placeholder="Buscar por Nome da Conta, ID, IP do Pagador ou MP Payment ID..." value="<?php echo htmlspecialchars($search_query); ?>">
            </div>
            <button type="submit" class="btn btn-primary">🔍 Buscar & Rastrear</button>
            <?php if (!empty($search_query)): ?>
                <a href="<?php echo ADMIN_URL; ?>?p=donations" class="btn btn-default">Limpar Filtro</a>
            <?php endif; ?>
        </form>
    </div>
</div>

<!-- 4. HISTÓRICO GERAL DE DOAÇÕES E AUDITORIA -->
<div class="box box-primary">
    <div class="box-header with-border">
        <h3 class="box-title">Histórico Geral de Pedidos & Controle Antifraude (Últimos 100)</h3>
    </div>
    <div class="box-body table-responsive">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Ref #</th>
                    <th>Conta / Pagador</th>
                    <th>Método / Detalhes</th>
                    <th>Pacote Premium</th>
                    <th>Valor</th>
                    <th>IP & E-mail</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações de Segurança</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($donations)): ?>
                    <?php foreach ($donations as $don):
                        $row_days = function_exists('get_donation_premium_days') ? (int)get_donation_premium_days($don) : (int)$don['coins'];
                        $row_pkg = function_exists('get_donation_package_name') ? get_donation_package_name($don) : ('PA (' . (int)$don['coins'] . ' dias)');
                    ?>
                    <tr style="<?php echo $don['status'] === 'charged_back' ? 'background-color: #fce4e4;' : ''; ?>">
                        <td><strong>#<?php echo $don['id']; ?></strong></td>
                        <td>
                            ID: <?php echo (int)$don['account_id']; ?><br>
                            <strong><?php echo htmlspecialchars($don['account_name']); ?></strong>
                        </td>
                        <td>
                            <?php if ($don['payment_method'] === 'tibia_coins'): ?>
                                <span class="label label-warning">🪙 Tibia Coins</span><br>
                                <small>Char: <?php echo htmlspecialchars($don['tibia_char_name']); ?></small>
                            <?php elseif ($don['payment_method'] === 'pix'): ?>
                                <span class="label label-success">⚡ PIX</span>
                                <?php if (!empty($don['mp_payment_id'])): ?>
                                    <br><small class="text-muted">MP: <?php echo htmlspecialchars($don['mp_payment_id']); ?></small>
                                <?php endif; ?>
                            <?php else: ?>
                                <span class="label label-info">💳 Cartão</span>
                                <br><small><strong>Bandeira:</strong> <?php echo !empty($don['card_brand']) ? strtoupper($don['card_brand']) : 'Cartão'; ?> (<?php echo isset($don['installments']) ? (int)$don['installments'] : 1; ?>x)</small>
                            <?php endif; ?>
                        </td>
                        <td><strong style="color: #15803d;"><?php echo htmlspecialchars($row_pkg); ?></strong><br><small class="text-muted"><?php echo $row_days; ?> dias de Premium</small></td>
                        <td><strong><?php echo htmlspecialchars($don['price']); ?></strong></td>
                        <td>
                            <small>IP: <?php echo !empty($don['payer_ip']) ? htmlspecialchars($don['payer_ip']) : '127.0.0.1'; ?></small><br>
                            <small><?php echo !empty($don['payer_email']) ? htmlspecialchars($don['payer_email']) : '-'; ?></small>
                        </td>
                        <td><?php echo date('d/m/Y H:i', $don['created_at']); ?></td>
                        <td>
                            <?php if ($don['status'] === 'completed'): ?>
                                <span class="label label-success" style="border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(180deg, #10b981 0%, #059669 100%) !important; border: 1px solid #047857; color: #ffffff; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);">
                                    <span style="width: 8px; height: 8px; background-color: #a7f3d0; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px #ffffff;"></span>
                                    <span>✓ Premium Ativo</span>
                                </span>
                            <?php elseif ($don['status'] === 'charged_back'): ?>
                                <span class="label label-danger" style="border-radius: 20px; padding: 6px 14px; font-weight: 600;">🚫 ESTORNADO / BANIDO</span>
                            <?php elseif ($don['status'] === 'canceled'): ?>
                                <span class="label label-default" style="border-radius: 20px; padding: 6px 14px;">Cancelado</span>
                            <?php else: ?>
                                <span class="label label-warning" style="border-radius: 20px; padding: 6px 14px; font-weight: 600;">Pendente</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php
                            $approve_days = $row_days > 0 ? $row_days : 90;
                            ?>
                            <?php if ($don['status'] === 'pending'): ?>
                                <a href="<?php echo ADMIN_URL; ?>?p=donations&action=approve&id=<?php echo $don['id']; ?>" class="btn btn-xs btn-success" style="border-radius: 16px; padding: 4px 12px; margin-bottom: 3px;" onclick="return confirm('Deseja aprovar e creditar <?php echo $approve_days; ?> dias de Premium nesta conta?');">✓ Aprovar +<?php echo $approve_days; ?>d</a>
                                <a href="<?php echo ADMIN_URL; ?>?p=donations&action=cancel&id=<?php echo $don['id']; ?>" class="btn btn-xs btn-default" style="border-radius: 16px; padding: 4px 10px; margin-bottom: 3px;" onclick="return confirm('Deseja cancelar este pedido?');">✗ Cancelar</a>
                            <?php endif; ?>

                            <?php if ($don['status'] !== 'charged_back'): ?>
                                <a href="<?php echo ADMIN_URL; ?>?p=donations&action=revert_chargeback&id=<?php echo $don['id']; ?>" class="btn btn-xs btn-danger" style="border-radius: 16px; padding: 4px 12px;" onclick="return confirm('ATENÇÃO: Deseja estornar este pedido, remover <?php echo $approve_days; ?> dias de Premium e BANIR PERMANENTEMENTE a conta ID <?php echo $don['account_id']; ?>?');">🚫 Estornar & Banir em Cadeia</a>
                            <?php else: ?>
                                <span class="text-danger"><strong>Conta Banida</strong></span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="9" class="text-center">Nenhum pedido de doação encontrado.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- 5. TABELA DE RASTREABILIDADE DE ITENS COMPRADOS -->
<?php if (!empty($item_traces)): ?>
<div class="box box-warning">
    <div class="box-header with-border">
        <h3 class="box-title">🛡️ Rastreabilidade de Itens Adquiridos com Coins (Auditoria Anti-Dupagem)</h3>
    </div>
    <div class="box-body table-responsive">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Trace ID #</th>
                    <th>Ref Doação #</th>
                    <th>Conta</th>
                    <th>Personagem Recebedor</th>
                    <th>Item Adquirido</th>
                    <th>Custo Coins</th>
                    <th>Status do Item</th>
                    <th>Data da Compra</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($item_traces as $it): ?>
                <tr>
                    <td><strong>#TR-<?php echo $it['id']; ?></strong></td>
                    <td><a href="<?php echo ADMIN_URL; ?>?p=donations&search=<?php echo $it['donation_id']; ?>">Doação #<?php echo $it['donation_id']; ?></a></td>
                    <td>Conta ID: <?php echo (int)$it['account_id']; ?></td>
                    <td><strong><?php echo htmlspecialchars($it['player_name']); ?></strong> (ID: <?php echo (int)$it['player_id']; ?>)</td>
                    <td><strong><?php echo htmlspecialchars($it['item_name']); ?></strong> (ID: <?php echo (int)$it['item_id']; ?> x<?php echo (int)$it['count']; ?>)</td>
                    <td><span class="label label-info"><?php echo (int)$it['coins_spent']; ?> Coins</span></td>
                    <td>
                        <?php if ($it['status'] === 'ACTIVE'): ?>
                            <span class="label label-success">Ativo no Jogo</span>
                        <?php else: ?>
                            <span class="label label-danger">🚫 REVERTIDO (ESTORNO)</span>
                        <?php endif; ?>
                    </td>
                    <td><?php echo date('d/m/Y H:i', $it['created_at']); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<?php endif; ?>

<!-- 6. LOGS DE AUDITORIA FINANCEIRA -->
<?php if (!empty($logs)): ?>
<div class="box box-info">
    <div class="box-header with-border">
        <h3 class="box-title">📜 Logs de Auditoria & Eventos Antifraude</h3>
    </div>
    <div class="box-body table-responsive">
        <table class="table table-bordered table-condensed">
            <thead>
                <tr>
                    <th>Data/Hora</th>
                    <th>Doação #</th>
                    <th>Conta ID</th>
                    <th>Evento</th>
                    <th>Detalhes do Registro</th>
                    <th>IP Registrado</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($logs as $l): ?>
                <tr>
                    <td><small><?php echo date('d/m/Y H:i:s', $l['created_at']); ?></small></td>
                    <td>#<?php echo (int)$l['donation_id']; ?></td>
                    <td>ID: <?php echo (int)$l['account_id']; ?></td>
                    <td><span class="label label-primary"><?php echo htmlspecialchars($l['event_type']); ?></span></td>
                    <td><small><?php echo htmlspecialchars($l['details']); ?></small></td>
                    <td><small><?php echo htmlspecialchars($l['ip']); ?></small></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<?php endif; ?>

<!-- 7. MODELO OFICIAL DE BALANCETE EM PDF PARA CONTABILIDADE / CONTADOR (CNPJ) -->
<style type="text/css">
@media print {
    body * {
        visibility: hidden;
    }
    #print-accountant-report, #print-accountant-report * {
        visibility: visible;
    }
    #print-accountant-report {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        font-family: 'Inter', Arial, sans-serif;
        color: #000;
        background: #fff;
        padding: 20px;
    }
    .no-print {
        display: none !important;
    }
}

.report-header-box {
    border-bottom: 2px solid #0f172a;
    padding-bottom: 16px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.report-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}
.report-table th, .report-table td {
    border: 1px solid #cbd5e1;
    padding: 8px 12px;
    font-size: 12px;
}
.report-table th {
    background-color: #f1f5f9;
    font-weight: 700;
    text-transform: uppercase;
}
</style>

<div id="print-accountant-report" class="no-print" style="display: none; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 30px; margin-top: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
    <div class="report-header-box">
        <div>
            <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #0f172a;">NOSLEIRA GAMES & SERVIÇOS DIGITAIS LTDA</h2>
            <div style="font-size: 13px; color: #475569; line-height: 1.5;">
                <strong>CNPJ:</strong> <span id="company-cnpj-display">00.000.000/0001-00</span> &bull; <strong>Inscrição Estadual:</strong> ISENTO<br>
                <strong>Razão Social:</strong> Nosleira OT Plataforma de Jogos Online<br>
                <strong>Documento:</strong> Demonstrativo do Resultado do Exercício &amp; Balancete Financeiro Segregado
            </div>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 12px; font-weight: 700; color: #64748b;">EMISSÃO REGISTRADA</div>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a;"><?php echo date('d/m/Y H:i:s'); ?></div>
            <button onclick="window.print();" class="btn btn-sm btn-primary no-print" style="margin-top: 10px; border-radius: 20px;"><i class="fa fa-file-pdf"></i> Salvar / Baixar PDF Oficial</button>
        </div>
    </div>

    <!-- DADOS DA EMPRESA EDITÁVEIS PARA O CONTADOR -->
    <div class="no-print" style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 14px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #334155;">⚙️ Configuração dos Dados do CNPJ da Empresa (Para o Relatório/PDF do Contador)</h4>
        <div class="row">
            <div class="col-md-6">
                <label style="font-size: 11px;">CNPJ da Empresa:</label>
                <input type="text" id="cnpj-input" value="00.000.000/0001-00" class="form-control input-sm" onkeyup="document.getElementById('company-cnpj-display').innerText = this.value;">
            </div>
            <div class="col-md-6">
                <label style="font-size: 11px;">Nome do Contador / Responsável Técnico:</label>
                <input type="text" id="accountant-input" value="Contabilidade & Assessoria Fiscal" class="form-control input-sm" onkeyup="document.getElementById('accountant-display').innerText = this.value;">
            </div>
        </div>
    </div>

    <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">1. RESUMO EXECUTIVO DE CAIXA E ATIVOS IN-GAME (FIAT VS. TIBIA COINS)</h3>
    <table class="report-table">
        <thead>
            <tr>
                <th>Conta / Categoria</th>
                <th>Volume Transacionado</th>
                <th>Receita Bruta (R$)</th>
                <th>Deduções / Estornos (R$)</th>
                <th>Receita Líquida (R$)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Caixa em Dinheiro Real (PIX)</strong></td>
                <td><?php echo $stats_method['pix']['count']; ?> transações</td>
                <td>R$ <?php echo number_format($stats_method['pix']['val'], 2, ',', '.'); ?></td>
                <td>- R$ 0,00</td>
                <td style="font-weight: 700; color: #047857;">R$ <?php echo number_format($stats_method['pix']['val'], 2, ',', '.'); ?></td>
            </tr>
            <tr>
                <td><strong>Caixa em Dinheiro Real (Cartão de Crédito)</strong></td>
                <td><?php echo $stats_method['stripe']['count']; ?> transações</td>
                <td>R$ <?php echo number_format($stats_method['stripe']['val'], 2, ',', '.'); ?></td>
                <td style="color: #dc2626;">- R$ <?php echo number_format($fiat_estornado_val, 2, ',', '.'); ?></td>
                <td style="font-weight: 700; color: #047857;">R$ <?php echo number_format(max(0, $stats_method['stripe']['val'] - $fiat_estornado_val), 2, ',', '.'); ?></td>
            </tr>
            <tr style="background-color: #f0fdf4; font-weight: 700;">
                <td><strong>SUBTOTAL CAIXA EM DINHEIRO REAL (FIAT)</strong></td>
                <td><?php echo $count_fiat_completed; ?> transações</td>
                <td>R$ <?php echo number_format($fiat_approved_val, 2, ',', '.'); ?></td>
                <td style="color: #dc2626;">- R$ <?php echo number_format($fiat_estornado_val, 2, ',', '.'); ?></td>
                <td style="color: #047857; font-size: 14px;">R$ <?php echo number_format($fiat_net_val, 2, ',', '.'); ?></td>
            </tr>
            <tr>
                <td><strong>Patrimônio em Ativos In-Game (Tibia Coins)</strong></td>
                <td><?php echo number_format($tc_total_coins, 0, ',', '.'); ?> TC (<?php echo $count_tc_completed; ?> trocas)</td>
                <td>R$ <?php echo number_format($tc_equivalent_brl, 2, ',', '.'); ?></td>
                <td>R$ 0,00</td>
                <td style="font-weight: 700; color: #6d28d9;">R$ <?php echo number_format($tc_equivalent_brl, 2, ',', '.'); ?></td>
            </tr>
            <tr style="background-color: #eff6ff; font-weight: 800; font-size: 13px;">
                <td>MONTANTE TOTAL CONSOLIDADO AVALIADO</td>
                <td><?php echo ($count_fiat_completed + $count_tc_completed); ?> operações</td>
                <td>R$ <?php echo number_format($fiat_approved_val + $tc_equivalent_brl, 2, ',', '.'); ?></td>
                <td style="color: #dc2626;">- R$ <?php echo number_format($fiat_estornado_val, 2, ',', '.'); ?></td>
                <td style="color: #0284c7; font-size: 15px;">R$ <?php echo number_format($total_overall_patrimony, 2, ',', '.'); ?></td>
            </tr>
        </tbody>
    </table>

    <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px; margin-top: 24px;">2. BALANCETE MENSAL DETALHADO DA OPERAÇÃO</h3>
    <table class="report-table">
        <thead>
            <tr>
                <th>Período (Mês/Ano)</th>
                <th>⚡ PIX (R$)</th>
                <th>💳 Cartão (R$)</th>
                <th>🚫 Estornos (R$)</th>
                <th>💰 Caixa Líquido FIAT (R$)</th>
                <th>🪙 Tibia Coins (Equiv. R$)</th>
                <th>🌐 Total Consolidado (R$)</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($monthly_balance as $mb): ?>
            <tr>
                <td><strong><?php echo htmlspecialchars($mb['label']); ?></strong></td>
                <td>R$ <?php echo number_format($mb['pix_brl'], 2, ',', '.'); ?></td>
                <td>R$ <?php echo number_format($mb['stripe_brl'], 2, ',', '.'); ?></td>
                <td style="color: #dc2626;"><?php echo $mb['fiat_chargeback'] > 0 ? ('- R$ ' . number_format($mb['fiat_chargeback'], 2, ',', '.')) : 'R$ 0,00'; ?></td>
                <td style="font-weight: 700; color: #047857;">R$ <?php echo number_format($mb['fiat_net'], 2, ',', '.'); ?></td>
                <td style="color: #6d28d9;">R$ <?php echo number_format($mb['tc_equivalent_brl'], 2, ',', '.'); ?> (<?php echo number_format($mb['tc_coins'], 0, ',', '.'); ?> TC)</td>
                <td style="font-weight: 800; color: #0284c7;">R$ <?php echo number_format($mb['total_consolidated'], 2, ',', '.'); ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; text-align: center;">
        <div style="width: 45%;">
            <div style="border-bottom: 1px solid #334155; margin-bottom: 6px; height: 40px;"></div>
            <div style="font-size: 12px; font-weight: 700; color: #1e293b;">Titular / Administrador Responsável</div>
            <div style="font-size: 11px; color: #64748b;">Nosleira OT - Gerência Financeira</div>
        </div>
        <div style="width: 45%;">
            <div style="border-bottom: 1px solid #334155; margin-bottom: 6px; height: 40px;"></div>
            <div style="font-size: 12px; font-weight: 700; color: #1e293b;" id="accountant-display">Contabilidade & Assessoria Fiscal</div>
            <div style="font-size: 11px; color: #64748b;">Responsável Técnico / Contador</div>
        </div>
    </div>
</div>

<script type="text/javascript">
function toggleAccountantReport() {
    var rep = document.getElementById('print-accountant-report');
    if (rep.style.display === 'none' || rep.classList.contains('no-print')) {
        rep.style.display = 'block';
        rep.classList.remove('no-print');
        rep.scrollIntoView({ behavior: 'smooth' });
    } else {
        rep.style.display = 'none';
        rep.classList.add('no-print');
    }
}
</script>

<div style="margin-top: 20px; text-align: center;">
    <button onclick="toggleAccountantReport();" class="btn btn-primary" style="border-radius: 20px; padding: 10px 24px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);">
        📄 Exibir / Gerar Relatório Contábil em PDF (Para Contador & CNPJ)
    </button>
</div>
