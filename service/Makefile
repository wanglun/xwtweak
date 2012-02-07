VERSION=unknown

# Device build
STAGING_DIR=${HOME}/stage
CC=arm-none-linux-gnueabi-gcc

CPPFLAGS := -g -DVERSION=\"${VERSION}\" -I${STAGING_DIR}/usr/include/glib-2.0 -I${STAGING_DIR}/usr/lib/glib-2.0/include -I${STAGING_DIR}/usr/include
LDFLAGS  := -g -L${STAGING_DIR}/usr/lib -llunaservice -lcjson -lmjson -lglib-2.0 -lgthread-2.0 -lgoodfork

xwtweak: xwtweak.o luna_service.o luna_methods.o

clobber:
	rm -rf *.o xwtweak
