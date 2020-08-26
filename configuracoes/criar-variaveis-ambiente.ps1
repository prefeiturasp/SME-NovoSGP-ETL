[Environment]::SetEnvironmentVariable("Sentry__DSN", "XXX", "Machine")
[Environment]::SetEnvironmentVariable("ConnectionStrings__SGP-Redis", "localhost", "Machine")
[Environment]::SetEnvironmentVariable("ConnectionStrings__SGP-Postgres", "User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=sgp_db;Pooling=true", "Machine")
[Environment]::SetEnvironmentVariable("JwtTokenSettings__IssuerSigningKey", "2A3B40C8D2215897C5EF1CC6D7D8469C687D17FDF85E675B6EBD9FBA26615B93805556652B9DDFD96CA9565C8D42EA83EF44CAC3B79AF64B343461B52FBB62EA", "Machine")
[Environment]::SetEnvironmentVariable("Logging__LogLevel__Default", "Debug", "Machine")
[Environment]::SetEnvironmentVariable("Nome-Instancia-Redis", "NovoSgp-", "Machine")
[Environment]::SetEnvironmentVariable("ExpiracaoCache__ObjetivosAprendizagem", "720", "Machine")
[Environment]::SetEnvironmentVariable("Logging__LogLevel__Microsoft", "Information", "Machine")
[Environment]::SetEnvironmentVariable("UrlApiJurema", "https://curriculo.sme.prefeitura.sp.gov.br/api/", "Machine")
[Environment]::SetEnvironmentVariable("UrlApiEOL", "https://dev-smeintegracaoapi.sme.prefeitura.sp.gov.br/api/", "Machine")
[Environment]::SetEnvironmentVariable("UrlApiAE", " https://dev-appaluno.sme.prefeitura.sp.gov.br/api/", "Machine")
[Environment]::SetEnvironmentVariable("UrlApiGithub", "https://api.github.com/", "Machine")
[Environment]::SetEnvironmentVariable("UsuarioGithub", "XXX", "Machine")
[Environment]::SetEnvironmentVariable("SenhaGithub", "XXX", "Machine")
[Environment]::SetEnvironmentVariable("UrlFrontEnd", "http://localhost:3000/", "Machine")
[Environment]::SetEnvironmentVariable("JwtTokenSettings__Audience", "Prefeitura de Sao Paulo", "Machine")
[Environment]::SetEnvironmentVariable("JwtTokenSettings__Issuer", "Novo SGP", "Machine")
[Environment]::SetEnvironmentVariable("JwtTokenSettings__ExpiresInMinutes", "720", "Machine")
[Environment]::SetEnvironmentVariable("FF_BackgroundEnabled", "true", "Machine")
[Environment]::SetEnvironmentVariable("HangfireUser_Admin", "admin:XXX", "Machine")
[Environment]::SetEnvironmentVariable("HangfireUser_Basic", "user:XXX", "Machine")
[Environment]::SetEnvironmentVariable("ConfiguracaoRabbit__HostName", "localhost", "Machine")
[Environment]::SetEnvironmentVariable("ConfiguracaoRabbit__UserName", "user", "Machine")
[Environment]::SetEnvironmentVariable("ConfiguracaoRabbit__Password", "bitnami", "Machine")
[Environment]::SetEnvironmentVariable("UrlBackEnd", "http://localhost:5001/", "Machine")
[Environment]::SetEnvironmentVariable("UrlServidorRelatorios", "http://localhost:5010/", "Machine")
[Environment]::SetEnvironmentVariable("ApiKeyEolApi", "XXX", "Machine")
