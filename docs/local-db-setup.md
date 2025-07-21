# WSL PostgreSQL Setup

## Why WSL1 + PostgreSQL
- Docker containers don't work properly in WSL1
- PostgreSQL runs natively in WSL1 for better compatibility
- Accessible from both Windows and WSL

## Setup Commands

### Install PostgreSQL
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Start and Configure
```bash
sudo service postgresql start
sudo -u postgres createdb lighthouse_tracker
sudo -u postgres psql -d lighthouse_tracker
```

In PostgreSQL prompt:
```sql
ALTER USER postgres PASSWORD 'postgres123';
\q
```

### Allow External Access
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
# Change: listen_addresses = '*'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add at end: host    all             all             0.0.0.0/0               md5

sudo service postgresql restart
```

## Quick Start Commands
```bash
sudo service postgresql start
```

## Daily Usage (after setup is done)
```bash
sudo service postgresql start
```

## Environment Variables (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lighthouse_tracker
DB_USER=postgres
DB_PASSWORD=postgres123
``` 