# =====================================================================
# GUÍA DE DESPLIEGUE SEGURO - FILITOUR EN VPS LINUX
# =====================================================================

## 📋 REQUISITOS PREVIOS

- Servidor Linux (Ubuntu 20.04+ recomendado)
- Docker y Docker Compose instalados
- Dominio apuntando a tu servidor (opcional pero recomendado para SSL)
- Puerto 80, 443 y 22 abiertos en el firewall

## 🔐 PASOS DE SEGURIDAD OBLIGATORIOS ANTES DE PRODUCIÓN

### 1. Configurar Firewall (UFW)

```bash
# Instalar UFW si no está instalado
sudo apt update && sudo apt install ufw -y

# Permitir solo los puertos necesarios
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (para Certbot)
sudo ufw allow 443/tcp   # HTTPS (después de configurar SSL)

# Activar firewall
sudo ufw enable
sudo ufw status
```

### 2. Instalar Fail2Ban (Protección contra ataques)

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado (reemplaza tudominio.com con tu dominio real)
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Los certificados se renuevan automáticamente
```

### 4. Cambiar Contraseñas por Defecto

**IMPORTANTE:** Después del primer despliegue:

1. Inicia sesión en el panel de administración
2. Usuario: `admin`
3. Contraseña: `admin123`
4. **CAMBIA LA CONTRASEÑA INMEDIATAMENTE**

### 5. Eliminar phpMyAdmin en Producción

El archivo `docker-compose.yml` ya tiene phpMyAdmin comentado por defecto.
Si necesitas acceso a la BD en producción, usa:

```bash
# Acceso seguro desde el servidor
docker exec -it filitour_mysql mysql -u root -p

# O crea un túnel SSH en lugar de exponer el puerto
ssh -L 3306:localhost:3306 usuario@tu-servidor
```

## 🚀 DESPLIEGUE AUTOMÁTICO

Ejecuta el script de despliegue:

```bash
cd /ruta/a/tu/proyecto
chmod +x deploy.sh
./deploy.sh
```

El script hará lo siguiente:
- Generará una contraseña segura para la base de datos
- Creará directorios de logs con permisos correctos
- Levantará los contenedores Docker
- Te mostrará las credenciales y siguientes pasos

## 📁 ESTRUCTURA DE ARCHIVOS SEGUROS

```
filitour/
├── secrets/
│   └── db_root_password.txt    # Contraseña segura (NO subir a Git)
├── app/storage/logs/
│   └── bruteforce/             # Logs de intentos de login
├── .env                        # Variables de entorno (NO subir a Git)
├── .env.example                # Ejemplo seguro (SÍ subir a Git)
├── docker-compose.yml          # Configuración Docker
└── deploy.sh                   # Script de despliegue
```

## 🔧 CONFIGURACIÓN DEL NGINX PARA PRODUCCIÓN

El archivo `docker/nginx/default.conf` incluye:

- ✅ Rate limiting (30 peticiones/segundo por IP)
- ✅ Timeouts ajustados (prevención Slowloris)
- ✅ Ocultación de versión de Nginx
- ✅ Bloqueo de archivos sensibles (.env, .git, .sql, etc.)
- ✅ Límite de subida de 5MB

Para producción con SSL, actualiza el server block:

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com;
    
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;
    
    # Resto de configuración...
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name tudominio.com;
    return 301 https://$server_name$request_uri;
}
```

## 🛡️ MEDIDAS DE SEGURIDAD IMPLEMENTADAS

### En la Aplicación:
- ✅ WAF (Web Application Firewall) integrado
- ✅ Prepared Statements (anti-SQL Injection)
- ✅ Protección CSRF con tokens
- ✅ Anti-Brute Force con Tarpitting
- ✅ Sessions seguras (HttpOnly, SameSite, Regenerate ID)
- ✅ Sanitización de outputs con htmlspecialchars

### En el Servidor:
- ✅ Contenedores Docker aislados
- ✅ Secrets de Docker para contraseñas
- ✅ Puertos de BD no expuestos
- ✅ Logs protegidos

## 📊 MONITOREO Y MANTENIMIENTO

### Ver logs de la aplicación:
```bash
docker logs filitour_php
docker logs filitour_nginx
```

### Ver logs de bruteforce:
```bash
ls -la app/storage/logs/bruteforce/
```

### Actualizar la aplicación:
```bash
git pull origin main
./deploy.sh
```

### Backup de la base de datos:
```bash
docker exec filitour_mysql mysqldump -u root -p<password> filitour_db > backup_$(date +%Y%m%d).sql
```

## ⚠️ ADVERTENCIAS IMPORTANTES

1. **NUNCA** subas el archivo `.env` o `secrets/` a Git
2. **SIEMPRE** cambia la contraseña del admin después del primer login
3. **NO** expongas el puerto de la base de datos en producción
4. **CONFIGURA** SSL antes de poner el sitio en producción
5. **REVISA** los logs regularmente buscando actividades sospechosas

## 🆘 SOPORTE Y SOLUCIÓN DE PROBLEMAS

### La aplicación no carga:
```bash
# Verificar que los contenedores estén corriendo
docker-compose ps

# Ver logs de errores
docker-compose logs app
docker-compose logs webserver
```

### Error de conexión a la base de datos:
```bash
# Verificar que la BD esté levantada
docker-compose ps db

# Ver logs de la BD
docker-compose logs db

# Reiniciar servicios
docker-compose restart db app
```

### Problemas de permisos:
```bash
# Corregir permisos de logs
chown -R www-data:www-data app/storage/logs
chmod -R 755 app/storage/logs
```

## 📞 CONTACTO

Para más información sobre seguridad y mejores prácticas, consulta:
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Docker Security Best Practices: https://docs.docker.com/engine/security/
- Let's Encrypt: https://letsencrypt.org/

=====================================================================
