# 日本語 Lofi - Firefox Addon

Extensión para Firefox que combina un temporizador Pomodoro con música lofi japonesa en vivo desde YouTube.

## Características

- 🍅 Temporizador Pomodoro (25 min trabajo / 5 min descanso)
- 🎵 Transmisión en vivo de música lofi japonesa
- 💖 Icono de corazón personalizado
- 🔔 Notificaciones de inicio/fin de sesiones
- 🔊 Alarma sonora configurable
- ⚙️ Tiempos personalizables
- 🎨 Interfaz moderna y responsiva

## Instalación

### Firefox

#### Desde Release (Recomendado)
1. Descarga el archivo `nihongo-lofi-1.0.0.xpi` de la sección de [Releases](../../releases)
2. Abre Firefox y arrastra el archivo `.xpi` a la ventana del navegador
3. Haz clic en "Añadir" cuando se te solicite confirmación
4. ¡Listo! Verás el icono de corazón 💖 en la barra de herramientas

#### Instalación Manual (Desarrollo)
1. Abre Firefox y ve a `about:debugging#/runtime/this-firefox`
2. Haz clic en "Cargar complemento temporal..."
3. Navega hasta la carpeta del proyecto y selecciona el archivo `manifest.json`
4. El addon se cargará temporalmente (se eliminará al cerrar Firefox)

## Uso

1. Haz clic en el icono de corazón 💖 en la barra de herramientas de Firefox
2. Se abrirá una ventana emergente con:
   - 🎥 Video de música lofi japonesa en vivo
   - ⏱️ Temporizador Pomodoro
   - ⚙️ Configuración (haz clic en el engranaje)
3. Haz clic en el botón ▶️ para iniciar el temporizador
4. Personaliza los tiempos de trabajo y descanso en la configuración
5. ¡Disfruta de la música mientras trabajas o estudias!

## Configuración

- **Trabajo**: Duración de las sesiones de trabajo (predeterminado: 25 minutos)
- **Descanso**: Duración de las sesiones de descanso (predeterminado: 5 minutos)
- **Notificaciones**: Activa/desactiva las notificaciones del navegador
- **Alarma**: Activa/desactiva el sonido de alarma

## Tecnologías

- Firefox WebExtensions API (Manifest V2)
- YouTube Embed Player API
- HTML5 + CSS3 + JavaScript
- Bootstrap 5.1.1
- Google Fonts (Roboto)

## Licencia

MIT License

## Créditos

- Música lofi: [YouTube Live Stream](https://www.youtube.com/live/d6f46ZUzJig)
- Icono de corazón: Custom
- Inspirado en la extensión Lofidoro de Jonathan Polina

## Autor

Kuro
