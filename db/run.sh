IMAGE="covid-bubble-db"
DB_NAME="CobuDB"
DB_DOCKER_INSTANCE_NAME="covid-bubble-db-instance"
ROOT_PW="123123"

# build db for gametrack
sudo docker build -t $IMAGE .

# set up MySQL DB locally
docker container stop $DB_DOCKER_INSTANCE_NAME
docker rm $DB_DOCKER_INSTANCE_NAME
docker run \
  --name $DB_DOCKER_INSTANCE_NAME \
  -e MYSQL_DATABASE=$DB_NAME \
  -e MYSQL_ROOT_PASSWORD=$ROOT_PW \
  -p 3306:3306 \
  -d $IMAGE
