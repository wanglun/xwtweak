#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/stat.h>

#include "luna_service.h"
#include "luna_methods.h"

#define HID_ACCELEROMETER "/var/run/hidd/AccelerometerEventSocket"
#define HID_ACCELEROMETER_BAK "/var/run/hidd/AccelerometerEventSocketXW"

bool dummy_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  LSError lserror;
  LSErrorInit(&lserror);

  if (!LSMessageRespond(message, "{\"returnValue\": true}", &lserror)) goto error;

  return true;
 error:
  LSErrorPrint(&lserror, stderr);
  LSErrorFree(&lserror);
 end:
  return false;
}

int accelState()
{
    struct stat buf;
    if (stat(HID_ACCELEROMETER, &buf)) {
        if (stat(HID_ACCELEROMETER_BAK, &buf)) {
            return -1;
        } else {
            return 0;
        }
    } else {
        return 1;
    }
}

//
// Call the listApps service using liblunaservice and return the output to webOS.
//
bool accelSetState_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
    int ret = 0;
    LSError lserror;
    LSErrorInit(&lserror);

    json_t *object = json_parse_document(LSMessageGetPayload(message));

    // Extract the id argument from the message
    json_t *id = json_find_first_label(object, "state");               
    if (!id || (id->child->type != JSON_STRING)) {
        if (!LSMessageReply(lshandle, message,
                    "{\"returnValue\": false, \"errorCode\": -1, \"errorText\": \"missing state\"}",
                    &lserror)) goto error;
        return true;
    }

    if (strcmp(id->child->text, "on") == 0) {
        if (accelState() == 0) {
            ret = rename(HID_ACCELEROMETER_BAK, HID_ACCELEROMETER);
        }
    } else if (strcmp(id->child->text, "off") == 0) {
        if (accelState() == 1) {
            ret = rename(HID_ACCELEROMETER, HID_ACCELEROMETER_BAK);
        }
    } else {
        if (!LSMessageReply(lshandle, message,
                    "{\"returnValue\": false, \"errorCode\": -2, \"errorText\": \"invalid state\"}",
                    &lserror)) goto error;
    }

    if (ret != 0) {
        if (!LSMessageReply(lshandle, message,
                    "{\"returnValue\": false, \"errorCode\": -3, \"errorText\": \"set state error\"}",
                    &lserror)) goto error;
    } else {
        if (!LSMessageReply(lshandle, message,
                    "{\"returnValue\": true}",
                    &lserror)) goto error;
        return true;
    }

error:
    LSErrorPrint(&lserror, stderr);
    LSErrorFree(&lserror);
end:
    return false;
}
//
// Call the listApps service using liblunaservice and return the output to webOS.
//
bool accelGetState_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
    LSError lserror;
    LSErrorInit(&lserror);

    switch (accelState()) {
        case 0:
            if (!LSMessageRespond(message, "{\"returnValue\": true, \"state\": \"off\"}", &lserror)) goto error;
            break;
        case 1:
            if (!LSMessageRespond(message, "{\"returnValue\": true, \"state\": \"on\"}", &lserror)) goto error;
            break;
        case -1:
            if (!LSMessageRespond(message, "{\"returnValue\": false, \"state\": \"E1\"}", &lserror)) goto error;
            break;
    }
    return true;
error:
    LSErrorPrint(&lserror, stderr);
    LSErrorFree(&lserror);
end:
    return false;
}

LSMethod luna_methods[] = {
    { "status", dummy_method },
    { "accelGetState", accelGetState_method },
    { "accelSetState", accelSetState_method },
    { 0, 0 }
};

bool register_methods(LSPalmService *serviceHandle, LSError lserror) {
    return LSPalmServiceRegisterCategory(serviceHandle, "/", luna_methods,
            NULL, NULL, NULL, &lserror);
}
