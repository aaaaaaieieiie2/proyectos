# 🌴 FiliTour - Sistema de Gestión Turística

Sistema web seguro y optimizado para la gestión de tours, playas y servicios turísticos.

## 🚀 Inicio Rápido

### Para Desarrollo Local

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd filitour

# Copiar archivo de entorno
cp .env.example .env

# Levantar contenedores
docker-compose up -d --build
```

Accede a: `http://localhost:8080`

### Para Producción (VPS Linux)

**IMPORTANTE:** Sigue estos pasos en orden:

```bash
# 1. Configurar seguridad del servidor (COMO ROOT)
sudo ./setup-vps-security.sh

# 2. Desplegar la aplicación
./deploy.sh
```

📖 **Lee la guía completa:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🔐 Credenciales por Defecto

- **Usuario:** admin
- **Contraseña:** admin123

⚠️ **CAMBIA LA CONTRASEÑA INMEDIATAMENTE DESPUÉS DEL PRIMER LOGIN**

## 📁 Estructura del Proyecto

```
filitour/
├── app/                    # Núcleo de la aplicación
│   ├── Controllers/        # Controladores (Auth, API, Stats)
│   ├── Security/           # WAF, CSRF, Anti-BruteForce, RateLimiter
│   ├── config/             # Configuración (DB, Env, Config)
│   └── storage/logs/       # Logs de seguridad
├── public/                 # Archivos públicos (Front Controller)
│   ├── index.php          # Página principal
│   ├── admin.php          # Panel de administración
│   ├── login.php          # Login seguro
│   └── api.php            # Endpoint API
├── database/               # Scripts de base de datos
│   └── schema.sql         # Estructura de la BD
├── docker/                 # Configuración Docker
│   ├── nginx/             # Config de Nginx + WAF
│   └── php/               # Config de PHP
├── secrets/                # Secretos de Docker (NO subir a Git)
├── docker-compose.yml      # Orquestación Docker
├── deploy.sh              # Script de despliegue
└── setup-vps-security.sh  # Script de seguridad VPS
```

## 🛡️ Características de Seguridad

### Implementadas en la Aplicación:
- ✅ **WAF (Web Application Firewall)** - Filtra ataques comunes
- ✅ **Prepared Statements** - Prevención total de SQL Injection
- ✅ **Protección CSRF** - Tokens en todos los formularios
- ✅ **Anti-Brute Force** - Con Tarpitting (retrasos intencionales)
- ✅ **Rate Limiting** - Límite de peticiones por IP
- ✅ **Sessions Seguras** - HttpOnly, SameSite, Regenerate ID
- ✅ **Sanitización de Outputs** - Prevención de XSS

### Implementadas en el Servidor:
- ✅ **Firewall UFW** - Solo puertos necesarios abiertos
- ✅ **Fail2Ban** - Protección contra ataques repetidos
- ✅ **Docker Secrets** - Contraseñas fuera del código
- ✅ **Nginx Hardening** - Timeouts, rate limiting, ocultación de versión

## 🔧 Configuración

### Variables de Entorno (.env)

```env
DB_HOST=db
DB_PORT=3306
DB_NAME=filitour_db
DB_USER=root
# DB_PASS se carga desde Docker Secrets en producción
```

### Puertos

| Servicio | Puerto | Acceso |
|----------|--------|--------|
| Web (HTTP) | 8080 | Público |
| MySQL | 3306 | **Solo interno** (comentado en producción) |
| phpMyAdmin | 8081 | **Desactivado** en producción |

## 📊 Base de Datos

El sistema incluye tablas para:
- Admins (usuarios del panel)
- Tours y Paquetes
- Playas
- Traslados
- Servicios
- Reservas (Bookings)
- Reseñas (Reviews)
- Configuración (Settings)

## 🛠️ Comandos Útiles

```bash
# Ver logs de la aplicación
docker-compose logs app
docker-compose logs webserver

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Backup de la base de datos
docker exec filitour_mysql mysqldump -u root -p$(cat secrets/db_root_password.txt) filitour_db > backup.sql

# Acceder a la consola de PHP
docker exec -it filitour_php sh

# Acceder a MySQL
docker exec -it filitour_mysql mysql -u root -p$(cat secrets/db_root_password.txt)
```

## 📝 Notas Importantes

1. **NUNCA** subas `.env` o `secrets/` a Git (ya están en `.gitignore`)
2. **SIEMPRE** cambia la contraseña del admin después del primer login
3. **CONFIGURA SSL** antes de poner el sitio en producción
4. **NO expongas** el puerto de la base de datos en producción
5. **REVISA** los logs regularmente

## 📞 Soporte

Para problemas o preguntas:
- Revisa [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Verifica los logs: `docker-compose logs`
- Consulta las mejores prácticas de OWASP

## 📄 Licencia

[Tu licencia aquí]

---

**Hecho con ❤️ para el turismo**
