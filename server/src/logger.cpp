#include "logger.h"
#include <iostream>
#include <ctime>
#include <sstream>
#include <iomanip>

static std::string escapeJsonString(const std::string& input) {
    std::ostringstream ss;
    for (auto c : input) {
        if (c == '"' || c == '\\') {
            ss << "\\" << c;
        } else if ('\x00' <= c && c <= '\x1f') {
            ss << "\\u" << std::hex << std::setw(4) << std::setfill('0') << (int)c;
        } else {
            ss << c;
        }
    }
    return ss.str();
}

static std::string getCurrentTimeIso8601() {
    time_t now;
    time(&now);
    char buf[sizeof "2011-10-08T07:07:09Z"];
    strftime(buf, sizeof buf, "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
    return std::string(buf);
}

void Logger::logLogin(const std::string& account, const std::string& ip, bool success, const std::string& message) {
    std::cout << "{\"time\":\"" << getCurrentTimeIso8601() 
              << "\",\"event\":\"login_attempt\""
              << ",\"account\":\"" << escapeJsonString(account) << "\""
              << ",\"ip\":\"" << escapeJsonString(ip) << "\""
              << ",\"status\":\"" << (success ? "success" : "failed") << "\""
              << ",\"message\":\"" << escapeJsonString(message) << "\"}" 
              << std::endl;
}

void Logger::logServerStart() {
    std::cout << "{\"time\":\"" << getCurrentTimeIso8601() 
              << "\",\"event\":\"server_start\""
              << ",\"status\":\"success\"}" 
              << std::endl;
}

void Logger::logServerStop() {
    std::cout << "{\"time\":\"" << getCurrentTimeIso8601() 
              << "\",\"event\":\"server_stop\""
              << ",\"status\":\"success\"}" 
              << std::endl;
}
