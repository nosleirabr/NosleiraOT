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
            // Intenção: Aprovar pedido e creditar NosleiraCoins com registro no livro razão
            $db->query("UPDATE `myaac_donations` SET `status` = 'completed', `updated_at` = " . time() . " WHERE `id` = " . $order_id);
            $db->query("UPDATE `accounts` SET `premium_points` = `premium_points` + " . (int)$order['coins'] . " WHERE `id` = " . (int)$order['account_id']);
            
            if (function_exists('trace_coin_movement')) {
                trace_coin_movement($order['account_id'], $order['coins'], 'DONATION_CREDIT', $order_id, 'Aprovação Manual via Painel Administrativo');
            }
            if (function_exists('log_donation_event')) {
                log_donation_event($order_id, $order['account_id'], 'MANUAL_APPROVAL', 'Pedido #' . $order_id . ' aprovado manualmente no Admin');
            }
            
            echo '<div class="alert alert-success"><strong>Sucesso!</strong> Pedido #' . $order_id . ' aprovado. ' . (int)$order['coins'] . ' NosleiraCoins foram creditadas na conta ID ' . (int)$order['account_id'] . '.</div>';
        } elseif ($act === 'revert_chargeback') {
            // Intenção: Acionar estorno e punição em cadeia
            if (function_exists('revert_fraudulent_donation')) {
                revert_fraudulent_donation($order_id, 'Estorno Solicitado Manualmente via Painel Admin');
            }
            echo '<div class="alert alert-danger"><strong>Estorno Executado!</strong> O pedido #' . $order_id . ' foi estornado. O saldo/itens vinculados foram deduzidos/revertidos e a conta foi banida permanentemente.</div>';
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

// Cálculo das Estatísticas Financeiras
$all_donations = $db->query("SELECT * FROM `myaac_donations` ORDER BY `id` DESC")->fetchAll();

$total_approved_val = 0.0;
$total_approved_coins = 0;
$total_estornado_val = 0.0;
$total_estornado_coins = 0;
$count_completed = 0;
$count_chargedback = 0;
$count_pending = 0;

$stats_method = array(
    'pix' => array('val' => 0.0, 'coins' => 0, 'count' => 0),
    'stripe' => array('val' => 0.0, 'coins' => 0, 'count' => 0, 'brands' => array(), 'installments' => array()),
    'tibia_coins' => array('coins' => 0, 'count' => 0)
);

if (!empty($all_donations)) {
    foreach ($all_donations as $d) {
        $price_clean = (float)str_replace(array('R$', ' ', '.'), array('', '', ''), str_replace(',', '.', $d['price']));
        $coins = (int)$d['coins'];
        $m = $d['payment_method'];

        if ($d['status'] === 'completed') {
            $total_approved_val += $price_clean;
            $total_approved_coins += $coins;
            $count_completed++;

            if ($m === 'pix') {
                $stats_method['pix']['val'] += $price_clean;
                $stats_method['pix']['coins'] += $coins;
                $stats_method['pix']['count']++;
            } elseif ($m === 'stripe') {
                $stats_method['stripe']['val'] += $price_clean;
                $stats_method['stripe']['coins'] += $coins;
                $stats_method['stripe']['count']++;

                $b = !empty($d['card_brand']) ? strtoupper($d['card_brand']) : 'DESCONHECIDO';
                $inst = isset($d['installments']) && (int)$d['installments'] > 0 ? (int)$d['installments'] : 1;
                
                $stats_method['stripe']['brands'][$b] = isset($stats_method['stripe']['brands'][$b]) ? $stats_method['stripe']['brands'][$b] + 1 : 1;
                $stats_method['stripe']['installments'][$inst] = isset($stats_method['stripe']['installments'][$inst]) ? $stats_method['stripe']['installments'][$inst] + 1 : 1;
            } elseif ($m === 'tibia_coins') {
                $stats_method['tibia_coins']['coins'] += $coins;
                $stats_method['tibia_coins']['count']++;
            }
        } elseif ($d['status'] === 'charged_back') {
            $total_estornado_val += $price_clean;
            $total_estornado_coins += $coins;
            $count_chargedback++;
        } elseif ($d['status'] === 'pending') {
            $count_pending++;
        }
    }
}

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

<!-- 1. DASHBOARD DE RESUMO FINANCEIRO -->
<div class="row" style="margin-bottom: 20px;">
    <div class="col-md-3">
        <div class="small-box bg-green" style="background-color: #27ae60 !important; color: #fff; padding: 15px; border-radius: 8px;">
            <div class="inner">
                <h3>R$ <?php echo number_format($total_approved_val, 2, ',', '.'); ?></h3>
                <p>Total Arrecadado Aprovado</p>
            </div>
            <div class="icon" style="font-size: 30px; opacity: 0.3;"><i class="fa fa-money"></i></div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="small-box bg-aqua" style="background-color: #2980b9 !important; color: #fff; padding: 15px; border-radius: 8px;">
            <div class="inner">
                <h3><?php echo number_format($total_approved_coins, 0, ',', '.'); ?></h3>
                <p>NosleiraCoins Entregues</p>
            </div>
            <div class="icon" style="font-size: 30px; opacity: 0.3;"><i class="fa fa-coins"></i></div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="small-box bg-red" style="background-color: #c0392b !important; color: #fff; padding: 15px; border-radius: 8px;">
            <div class="inner">
                <h3>R$ <?php echo number_format($total_estornado_val, 2, ',', '.'); ?></h3>
                <p>Total Estornado / Chargeback (<?php echo $count_chargedback; ?>)</p>
            </div>
            <div class="icon" style="font-size: 30px; opacity: 0.3;"><i class="fa fa-ban"></i></div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="small-box bg-yellow" style="background-color: #f39c12 !important; color: #fff; padding: 15px; border-radius: 8px;">
            <div class="inner">
                <h3><?php echo $count_completed; ?> / <?php echo $count_pending; ?></h3>
                <p>Concluídas / Pendentes</p>
            </div>
            <div class="icon" style="font-size: 30px; opacity: 0.3;"><i class="fa fa-shopping-cart"></i></div>
        </div>
    </div>
</div>

<!-- 2. DETALHAMENTO POR MÉTODO DE PAGAMENTO -->
<div class="row" style="margin-bottom: 20px;">
    <div class="col-md-4">
        <div class="box box-success" style="border-top: 3px solid #27ae60;">
            <div class="box-header with-border"><h4 class="box-title">⚡ Pagamentos em PIX</h4></div>
            <div class="box-body">
                <p><strong>Total Recebido:</strong> R$ <?php echo number_format($stats_method['pix']['val'], 2, ',', '.'); ?></p>
                <p><strong>Coins Creditadas:</strong> <?php echo number_format($stats_method['pix']['coins'], 0, ',', '.'); ?> Coins</p>
                <p><strong>Vendas Concluídas:</strong> <?php echo $stats_method['pix']['count']; ?> pedidos</p>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="box box-info" style="border-top: 3px solid #2980b9;">
            <div class="box-header with-border"><h4 class="box-title">💳 Cartão de Crédito (Mercado Pago)</h4></div>
            <div class="box-body">
                <p><strong>Total Recebido:</strong> R$ <?php echo number_format($stats_method['stripe']['val'], 2, ',', '.'); ?></p>
                <p><strong>Coins Creditadas:</strong> <?php echo number_format($stats_method['stripe']['coins'], 0, ',', '.'); ?> Coins</p>
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
            <div class="box-header with-border"><h4 class="box-title"><img src="../images/nosleira_coin.svg" alt="N" style="height: 18px; width: 18px; vertical-align: middle; margin-right: 4px;"> Tibia Coins (Troca Direct)</h4></div>
            <div class="box-body">
                <p><strong>NosleiraCoins Entregues:</strong> <?php echo number_format($stats_method['tibia_coins']['coins'], 0, ',', '.'); ?> Coins</p>
                <p><strong>Vendas Concluídas:</strong> <?php echo $stats_method['tibia_coins']['count']; ?> pedidos</p>
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
                    <th>Pacote Coins</th>
                    <th>Valor</th>
                    <th>IP & E-mail</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações de Segurança</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($donations)): ?>
                    <?php foreach ($donations as $don): ?>
                    <tr style="<?php echo $don['status'] === 'charged_back' ? 'background-color: #fce4e4;' : ''; ?>">
                        <td><strong>#<?php echo $don['id']; ?></strong></td>
                        <td>
                            ID: <?php echo (int)$don['account_id']; ?><br>
                            <strong><?php echo htmlspecialchars($don['account_name']); ?></strong>
                        </td>
                        <td>
                            <?php if ($don['payment_method'] === 'tibia_coins'): ?>
                                <span class="label label-warning"><img src="../images/nosleira_coin.svg" alt="N" style="height: 14px; width: 14px; vertical-align: middle; margin-right: 2px;"> Tibia Coins</span><br>
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
                        <td><strong style="color: #27ae60;"><?php echo (int)$don['coins']; ?> Coins</strong></td>
                        <td><strong><?php echo htmlspecialchars($don['price']); ?></strong></td>
                        <td>
                            <small>IP: <?php echo !empty($don['payer_ip']) ? htmlspecialchars($don['payer_ip']) : '127.0.0.1'; ?></small><br>
                            <small><?php echo !empty($don['payer_email']) ? htmlspecialchars($don['payer_email']) : '-'; ?></small>
                        </td>
                        <td><?php echo date('d/m/Y H:i', $don['created_at']); ?></td>
                        <td>
                            <?php if ($don['status'] === 'completed'): ?>
                                <span class="label label-success">✓ Aprovado</span>
                            <?php elseif ($don['status'] === 'charged_back'): ?>
                                <span class="label label-danger">🚫 ESTORNADO / BANIDO</span>
                            <?php elseif ($don['status'] === 'canceled'): ?>
                                <span class="label label-default">Cancelado</span>
                            <?php else: ?>
                                <span class="label label-warning">Pendente</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if ($don['status'] === 'pending'): ?>
                                <a href="<?php echo ADMIN_URL; ?>?p=donations&action=approve&id=<?php echo $don['id']; ?>" class="btn btn-xs btn-success" onclick="return confirm('Deseja aprovar e creditar <?php echo $don['coins']; ?> NosleiraCoins nesta conta?');">✓ Aprovar</a>
                                <a href="<?php echo ADMIN_URL; ?>?p=donations&action=cancel&id=<?php echo $don['id']; ?>" class="btn btn-xs btn-default" onclick="return confirm('Deseja cancelar este pedido?');">✗ Cancelar</a>
                            <?php endif; ?>

                            <?php if ($don['status'] !== 'charged_back'): ?>
                                <a href="<?php echo ADMIN_URL; ?>?p=donations&action=revert_chargeback&id=<?php echo $don['id']; ?>" class="btn btn-xs btn-danger" onclick="return confirm('ATENÇÃO: Deseja estornar este pedido, deduzir as NosleiraCoins/itens comprados e BANIR PERMANENTEMENTE a conta ID <?php echo $don['account_id']; ?>?');">🚫 Estornar & Banir em Cadeia</a>
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
