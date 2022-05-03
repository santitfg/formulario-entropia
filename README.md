# Formulario-entropia

## Aplicación Web para formulario de inscripción a un seminario preuniversitario, desarrollada buscando aprovechar el nivel gratuito (free tier) de [GCP](cloud.google.com/) y de [Firebase](https://firebase.google.com/) 

Realizada durante mediados de febrero.
Estando activo durante el periodo marzo y abril 2022 en firebase y permitiendo el ingreso de más 500 estudiantes a un curso preuniversitario sin generar costes ( de hosting, base de datos, o mailing.).

Resumen de soluciones de bajo costo:
- Aplicación web en forma de formulario asociada a firebase con base de datos
- Api para comprobación de duplicados 
- Firebase functions para envio automatico de mails
- lista de espera en caso de sobrepasar umbrales gratuitos de sendgrid.
 ---
##### #Google Cloud Platform #Firebase #Vue.js #JavaScript #sendGrid #Pyhton

## DETALLES TECNICOS:

Uso de [GCP](cloud.google.com/) y [Firebase](https://firebase.google.com/)

### Cloud run para una api de comprobación de cargas duplicadas 

### Firebase Hosting para alojar el sitio web

### Firebase native DB para el almacenamiento de:
- Información de estudiantes
- Colecciones de escuelas argentinas divididas por provincias para proveer al formulario
- Una pequeña colección para proveer a las firebase Functions en sus respectivas tareas (jobs)

### Seguridad
Aplique una capa de seguridad simple con Firebase Rules según los requerimientos de uso de cada una de las colecciones y Cors para la api de Cloud Run.


### Automatización de mailing

Firebase Functions y google Schedule con NodeMailer (con SendGrid para brindar SMTP)
para el envío automático de diversos mails según el perfil del estudiante a ingresar en la base de datos 
y un conteo de mails por dia para no superar el límite de gratuito de SendGrid, generando una pila ante un exceso de mails, en días donde la inscripción era cuantiosa


### Data Wrangling

Uso de Python y Google Colab para el manejo de la información de las escuelas hice un análisis detallado de índices e información a conservar , simplificando de 41 columnas a 15 con información indispensable, y de 62000 filas a 20000 buscadas. a su vez que busque identificar posibles incongruencias entre el [padron de escuelas argentinas](https://datos.gob.ar/ar/dataset/educacion-padron-oficial-establecimientos-educativos) y la [API del Servicio de Normalización de Datos Geográficos de Argentina](https://datosgobar.github.io/georef-ar-api/) para asi subsanarlas en las consultas.
Y finalmente seleccione la base en pequeñas colecciones e importe directamente a Firebase 

#### PD: originamente el proyecto contaba con un manejo de [Leaflet](https://leafletjs.com) para facilitar el ingreso de la informacion geografica que fue dejando de lado para simplificar el camino de usuario  


----

![vistas de la web (2)](https://user-images.githubusercontent.com/88756407/166302675-fbb0d039-8528-437d-a327-33db3fcfaae6.jpg)
