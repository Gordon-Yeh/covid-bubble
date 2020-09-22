# reference: https://medium.com/better-programming/customize-your-mysql-database-in-docker-723ffd59d8fb

FROM mysql:5.7

ENV MYSQL_DATABASE CobuDB

# any sql scripts to populate the DB
COPY ./*.sql /docker-entrypoint-initdb.d/
