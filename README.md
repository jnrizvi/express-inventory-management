# express-inventory-management

## Setup
If you don’t have the Postgres Docker Official Image, you can get the one with the latest version of PostgreSQL from Docker Hub.
Run this command in your terminal:
```
docker pull postgres:latest
```
To start a PostgreSQL instance (i.e. create a PostgreSQL Docker Container), use the `docker run` command:
```
docker run --name <container name> -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```
The environment variable `POSTGRES_PASSWORD` must be set (using the `-e` flag) to a non-empty value. It’s for the superuser, and the database won’t initialize if it’s left out.

The localhost port map (specified by `-p` flag) must also be specified, otherwise Prisma won’t be able to connect to the container.

Now that the PostgreSQL container has been created and is running, you can run commands within it. You might want to create a separate database called `inventory_management` through a new user.

Use this command to connect to the PostgreSQL server:
```
 docker exec -it <container name> psql -U postgres -d postgres
```
Install the project's dependencies
```
npm install
```
Now, create a `.env` file and make sure it contains the following line so Prisma can connect to the container:
```
DATABASE_URL="postgresql://username:password@localhost:5432/inventory_management?schema=public&connection_limit=5&socket_timeout=3"
```
You can test if the database connection was successful by running the app
```
npm run dev
```
To populate the database with tables defined in `schema.prisma`, and run the seeder, use the command:
```
npx prisma migrate dev
```
You're all set to use the app now.