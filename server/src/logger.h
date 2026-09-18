#ifndef FS_LOGGER_H
#define FS_LOGGER_H

#include <string>

class Logger {
public:
    static void logLogin(const std::string& account, const std::string& ip, bool success, const std::string& message = "");
    static void logServerStart();
    static void logServerStop();
};

#endif
