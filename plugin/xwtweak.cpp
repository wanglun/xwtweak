#include <stdio.h>
#include <sys/stat.h>
#include <syslog.h>
     
#include "SDL.h"
#include "PDL.h"

#define HID_ACCELEROMETER "/var/run/hidd/AccelerometerEventSocket"
#define HID_ACCELEROMETER_BAK "/var/run/hidd/AccelerometerEventSocketXW"

static PDL_bool getState(PDL_JSParameters *params)
{
    struct stat buf;
    if (stat(HID_ACCELEROMETER, &buf)) {
        PDL_JSReply(params, "off");
    } else {
        PDL_JSReply(params, "on");
    }

    return PDL_TRUE;
}

static PDL_bool setState(PDL_JSParameters *params)
{
    if (PDL_GetNumJSParams(params) != 1) {
        PDL_JSException(params, "wrong number of parameters for setState");
        return PDL_FALSE;
    }

    /* 0: disable 1: enable */
    int mode = PDL_GetJSParamInt(params, 0);
    int ret = 0;

    if (mode) {
        ret = rename(HID_ACCELEROMETER_BAK, HID_ACCELEROMETER);
    } else {
        ret = rename(HID_ACCELEROMETER, HID_ACCELEROMETER_BAK);
    }

    if (ret == 0) {
        return PDL_TRUE;
    } else {
        return PDL_FALSE;
    }
}

int main(int argc, char** argv)
{
    int result = SDL_Init(SDL_INIT_VIDEO);
   
    if ( result != 0 ) {
        exit(1);
    }

    PDL_Init(0);

    if (!PDL_IsPlugin()) {
        rename(HID_ACCELEROMETER, HID_ACCELEROMETER_BAK);
        return 0;
    }

    PDL_RegisterJSHandler("getState", getState);
    PDL_RegisterJSHandler("setState", setState);
    PDL_JSRegistrationComplete();

    PDL_CallJS("ready", NULL, 0);

    SDL_Event event;
    do {
        SDL_WaitEvent(&event);
        
        if (event.type == SDL_USEREVENT) {
            ;
        }
        
    } while (event.type != SDL_QUIT);

    PDL_Quit();
    SDL_Quit();

    return 0;
}
