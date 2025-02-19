# Forum

## Description
Forum is a web application built with Angular, .NET, and MSSQL. The platform allows users to register and post messages, either as main comments or as replies to other comments. Users can attach various files such as HomePage, JPG, GIF, PNG, and TXT files to their messages. The main page displays a table with the primary comments and allows sorting. By clicking on a row in the table, users can navigate to the main comment along with its nested replies.

You can view the project documentation on [Google Drive](https://drive.google.com/file/d/11oer-b-a54AyhwUlJrUAmYdtbNwCrEB8/view?usp=sharing).

## Features
- User registration
- Main and nested comments
- Attachments (HomePage, JPG, GIF, PNG, TXT)
- Sorting comments on the main page
- Navigation between main comments and replies

## Built With
- [Angular](https://angular.io/)
- [ASP.NET Core](https://dotnet.microsoft.com/en-us/learn/aspnet)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server)

## Docker Configuration

The following `docker-compose.yml` file configures the application with three services: 
1. Angular App
2. MSSQL Server
3. API (Forum API)

```yaml
version: '3.8'

services:
  angular-app:
    build:
      context: ./Client
      dockerfile: Dockerfile
    ports:
      - "4200:4200"
    volumes:
      - ./Client:/usr/src/app
      - /usr/src/app/node_modules
    stdin_open: true
    tty: true
    networks:
      - demoappnetwork

  mssql-container:
    image: mcr.microsoft.com/mssql/server:latest
    container_name: mssql-container
    environment:
      - ACCEPT_EULA=Y 
      - SA_PASSWORD=MyDemoPassword@2025
    ports:
      - "8002:1433"
    networks:
      - demoappnetwork

  forum.api:
    image: ${DOCKER_REGISTRY-}forumapi
    build:
      context: ./Server
      dockerfile: Forum.Api/Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - mssql-container
    networks:
      - demoappnetwork
    volumes:
    - ./Server/Forum.Api/wwwroot:/app/wwwroot
    environment:
      - ConnectionStrings__ForumSqlServer=Server=mssql-container,1433;Database=Forum;User Id=sa;Password=MyDemoPassword@2025;TrustServerCertificate=True;MultipleActiveResultSets=true
      - Jwt__Key=A1b2C3d4E5f6G7h8I9J0K1L2M3N4O5P6
      - Jwt__ExpireDays=1
      - Jwt__Issuer=https://localhost:4200
      - Jwt__Audience=https://localhost:4200
      - Authentication__Forum__Provider=FORUM
      - Authentication__Forum__TokenName=ForumToken
      - Logging__LogLevel__Default=Information
      - Logging__LogLevel__Microsoft.AspNetCore=Warning
    command: >
      bash -c "until nc -z -v -w30 mssql-container 1433; do echo waiting for mssql; sleep 5; done; dotnet ef database update"

networks:
  demoappnetwork:
    driver: bridge
```

## Getting Started

### Prerequisites
- Docker and Docker Compose should be installed on your system.

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/OleksiiIhnatiev/Forum.git
   ```
2. Navigate to the project directory
   ```sh
   cd forum
   ```
3. Build and start the containers
   ```sh
   docker-compose up --build
   ```

4. Access the Angular app at `http://localhost:4200/`

5. The API will be available at `http://localhost:8080/`

## Usage

Once the application is running, users can:

- Register and log in.
- Post main comments and replies.
- Attach files (HomePage, JPG, GIF, PNG, TXT).
- Sort and view comments on the homepage.
- Click on a comment to see nested replies.
