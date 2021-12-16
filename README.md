Aplikace byla vyvíjena a testována na následujících verzích:
- postgres: 14
- maven: 3.8.4
- npm: 6.14.8

Nástavení databáze:
- api\src\main\resources\application.properties - obsahuje nastavení přípojení k databáze pro api

Aplikaci lze spustit pomoci Docker:
- instrukce pro instalaci zde: https://docs.docker.com/compose/install/
- v kořenové složce se nachází soubor docker-comose.yml
- lze spustit příkazem docker-compose up

Aplikaci lze spustit ve vývojovém prostředí:
- prvně musíte mít spuštěn databázový server postgres
- příkaz: pg_ctl pro windows, psql pro linux
- následně ve složce api, příkazem mvn spring-boot:run spustíte serverovou část
- klientská část se spustí ve složce client, příkazem npm start