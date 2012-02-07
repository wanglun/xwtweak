APPID = com.xwteam.app.xwtweak

STRIP=arm-none-linux-gnueabi-strip

device:
	cd ../service && ${MAKE}

package: clean device
	rm -r STAGING && cp -r ../enyo STAGING && mkdir STAGING/service
	cp ../service/xwtweak STAGING/service
	${STRIP} STAGING/service/xwtweak
	cp ../service/${APPID}* STAGING/service
	palm-package STAGING
	ar q ${APPID}_*.ipk pmPostInstall.script
	ar q ${APPID}_*.ipk pmPreRemove.script

test: package
	- palm-install -r ${APPID}
	palm-install ${APPID}_*.ipk
	palm-launch ${APPID}

install: package
	palm-install ${APPID}_*.ipk
	palm-launch ${APPID}

clean:
	find . -name '*~' -delete
	rm -f ipkgtmp*.tar.gz ${APPID}_*.ipk

clobber: clean
	cd service && ${MAKE} clobber
