#!/bin/bash
# =====================================================================
# SCRIPT DE CONFIGURACIÓN DE SEGURIDAD PARA VPS - FILITOUR
# Ejecuta ESTE script en tu VPS ANTES de desplegar la aplicación
# =====================================================================

set -e

echo "🔐 Configurando seguridad del servidor para FiliTour..."

# Verificar si se está ejecutando como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Error: Este script debe ejecutarse como root (usa sudo)"
    exit 1
fi

# =====================================================================
# 1. CONFIGURAR FIREWALL (UFW)
# =====================================================================
echo ""
echo "📡 Configurando Firewall (UFW)..."

# Instalar UFW si no está instalado
if ! command -v ufw &> /dev/null; then
    echo "   Instalando UFW..."
    apt update && apt install ufw -y
fi

# Resetear reglas existentes (opcional, comentar si ya tienes reglas configuradas)
ufw --force reset

# Política por defecto: DENEGAR todo el tráfico entrante
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH (IMPORTANTE: hacerlo antes de activar el firewall)
echo "   Permitiendo SSH (puerto 22)..."
ufw allow 22/tcp comment 'SSH Access'

# Permitir HTTP y HTTPS
echo "   Permitiendo HTTP (puerto 80) y HTTPS (puerto 443)..."
ufw allow 80/tcp comment 'HTTP for Let''s Encrypt'
ufw allow 443/tcp comment 'HTTPS Traffic'

# NO permitir el puerto de MySQL/MariaDB desde el exterior
echo "   ⚠️  Puerto de BD (3306/3307) BLOQUEADO - Solo acceso interno Docker"

# Activar UFW
echo "   Activando firewall..."
echo "y" | ufw enable

# Mostrar estado
echo "   Estado del firewall:"
ufw status verbose

# =====================================================================
# 2. INSTALAR FAIL2BAN
# =====================================================================
echo ""
echo "🛡️  Instalando Fail2Ban (protección contra ataques)..."

if ! command -v fail2ban-server &> /dev/null; then
    apt install fail2ban -y
fi

# Configurar Fail2Ban para proteger SSH y Nginx
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = auto

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/*error.log
maxretry = 10
bantime = 3600

[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/*error.log
maxretry = 5
EOF

# Reiniciar Fail2Ban
systemctl restart fail2ban
systemctl enable fail2ban

echo "   ✅ Fail2Ban instalado y configurado"

# =====================================================================
# 3. ACTUALIZAR SISTEMA
# =====================================================================
echo ""
echo "🔄 Actualizando paquetes del sistema..."
apt update
apt upgrade -y

# Instalar herramientas útiles
echo "   Instalando herramientas adicionales..."
apt install -y curl wget git unzip htop net-tools

# =====================================================================
# 4. VERIFICAR DOCKER
# =====================================================================
echo ""
echo "🐳 Verificando instalación de Docker..."

if ! command -v docker &> /dev/null; then
    echo "   ❌ Docker no está instalado. Instalando..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "   ✅ Docker ya está instalado"
fi

if ! command -v docker-compose &> /dev/null; then
    echo "   Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "   ✅ Docker Compose ya está instalado"
fi

# =====================================================================
# 5. CONFIGURAR SSL (CERTBOT) - OPCIONAL
# =====================================================================
echo ""
echo "🔒 ¿Deseas configurar SSL con Let's Encrypt ahora?"
read -p "Ingresa tu dominio (o presiona Enter para saltar este paso): " DOMAIN

if [ -n "$DOMAIN" ]; then
    echo "   Instalando Certbot..."
    apt install certbot python3-certbot-nginx -y
    
    echo "   Obteniendo certificado para: $DOMAIN"
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    echo "   ✅ SSL configurado correctamente"
    echo "   ℹ️  La renovación automática está configurada"
else
    echo "   ⏭️  Saltando configuración de SSL"
    echo "   ℹ️  Puedes ejecutar esto después: certbot --nginx -d tudominio.com"
fi

# =====================================================================
# 6. RESUMEN FINAL
# =====================================================================
echo ""
echo "====================================================================="
echo "✅ CONFIGURACIÓN DE SEGURIDAD COMPLETADA"
echo "====================================================================="
echo ""
echo "📋 RESUMEN DE SEGURIDAD:"
echo ""
echo "   🔥 Firewall (UFW):"
echo "      ✅ Puerto 22 (SSH) - ABIERTO"
echo "      ✅ Puerto 80 (HTTP) - ABIERTO"
echo "      ✅ Puerto 443 (HTTPS) - ABIERTO"
echo "      ❌ Puerto 3306/3307 (MySQL) - BLOQUEADO"
echo "      ❌ Todos los demás puertos - BLOQUEADOS"
echo ""
echo "   🛡️  Fail2Ban:"
echo "      ✅ Protegiendo SSH (3 intentos fallidos = 1 hora de ban)"
echo "      ✅ Protegiendo Nginx (10 intentos = 1 hora de ban)"
echo ""
echo "   🐳 Docker:"
echo "      ✅ Docker instalado"
echo "      ✅ Docker Compose instalado"
echo ""
if [ -n "$DOMAIN" ]; then
echo "   🔒 SSL/TLS:"
echo "      ✅ Certificado Let's Encrypt instalado para: $DOMAIN"
echo "      ✅ Renovación automática configurada"
fi
echo ""
echo "🚀 SIGUIENTE PASO:"
echo "   Ahora puedes ejecutar el script de despliegue:"
echo "   ./deploy.sh"
echo ""
echo "====================================================================="
echo ""
