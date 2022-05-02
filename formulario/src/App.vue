<template>
  <div class="contenedor">
    <div class="logo">
      <img src="banner-utn.png" alt="banner utn" />
      <img src="banner-entropia.png" alt="banner entropias" />
    </div>
    <h1>FORMULARIO ENTROPIA UTN 2022</h1>

    <div v-if="fallaComunicacionApi">
      Existe una falla en la comunicacion intente mas tarde
    </div>

    <div v-else>
      <div v-if="envioForm == respuesta">
        <p>
          El formulario se guardo correctamente,<br />
          REVISE porfavor su casilla de mail
          <br />
          y no se olvide de revisar la zona de SPAM
        </p>
      </div>
      <div v-else-if="envioForm && !respuesta && respuesta !== null">
        el Formulario ha sido rebotado, ingresó un mail o documento ya
        existentes en nuestros registros
      </div>

      <div v-else-if="envioForm">
        se envio formulario, <br />
        Aguardando confirmacion de envio
      </div>

      <form v-else>
        <div class="datos">
          <h2>Datos personales</h2>
          <div class="contenido">
            <div class="par">
              <label for="nombre">Tu Nombre Completo:</label>
              <input
                type="text"
                id="nombre"
                v-model="nombre"
                name="nombre"
                :class="{ revisar: revisiones.nombre }"
              />
              <div v-if="revisiones.nombre">
                <p>
                  <span class="revisar"> Por favor completa tu nombre </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="apellido">Tu Apellido Completo:</label>

              <input
                type="text"
                id="apellido"
                v-model="apellido"
                name="apellido"
                :class="{ revisar: revisiones.apellido }"
              />
              <div v-if="revisiones.apellido">
                <p>
                  <span class="revisar"> Por favor completa tu apellido </span>
                </p>
              </div>
            </div>
            <br />
            <div class="par">
              <label for="tipoDocumento"> Tipo documento</label>

              <select
                id="tipoDoc"
                name="tipoDoc"
                v-model="tipoDocumento"
                :class="{ revisar: revisiones.tipoDocumento }"
              >
                <option value="DNI">DNi</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
              <div v-if="revisiones.tipoDocumento">
                <p>
                  <span class="revisar">
                    Por favor completa tu tipo de documento
                  </span>
                </p>
              </div>
            </div>
            <br />
            <div class="par">
              <label for="documento">Tu documento:</label>

              <input
                type="text"
                id="documento"
                v-model="documento"
                name="documento"
                :disabled="tipoDocumento == null"
                :class="{ revisar: revisiones.documento }"
              />
              <div v-if="revisiones.documento">
                <p>
                  <span class="revisar"> Por favor completa tu documento </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                v-model="fechaNacimiento"
                name="fechaNacimiento"
                :class="{ revisar: revisiones.fechaNacimiento }"
              />
              <div v-if="revisiones.fechaNacimiento">
                <p>
                  <span class="revisar">
                    Por favor completa tu fecha de Nacimiento
                  </span>
                </p>
              </div>
            </div>
            <br /><br />
            <div class="par">
              <label for="sexoBio">Sexo Biologico</label>
              <select
                id="sexoBio"
                v-model="sexoBio"
                name="sexoBio"
                :class="{ revisar: revisiones.sexoBio }"
              >
                <option value="Femenino">Femenino</option>
                <option value="Maculino">Maculino</option>
              </select>
              <div v-if="revisiones.sexoBio">
                <p>
                  <span class="revisar">
                    Por favor completa tu sexo Biologico
                  </span>
                </p>
              </div>
            </div>
            <br />
            <br />
            <br />
          </div>
          <!-- <h3>Seleccion el tipo de busqueda de provincia:</h3> -->
          <!-- <h3>Donde vivís:</h3> -->

          <!-- <input
            type="radio"
            id="buscador"
            name="buscador"
            value="buscador"
            v-model="tipoBusqueda"
          />
          <label for="buscador">por campos</label><br />

          <input
            type="radio"
            id="mapa"
            name="mapa"
            value="mapa"
            v-model="tipoBusqueda"
          />
          <label for="mapa">por mapa</label><br /> -->

          <br />
          <div class="contenido">
            <br />
            <!-- <div v-if="tipoBusqueda === 'buscador'" class="opciones"> -->
            <br />
            <div class="par">
              <label for="provincia">Provincia </label>

              <select
                id="provincia"
                v-model="dataRef.provincia"
                name="provincia"
                @change="consultarDataGeoRef(dataRef, 'departamentos')"
              >
                <option v-for="name in listaProv" :key="name">
                  {{ name }}
                </option>
              </select>
            </div>
            <br />

            <div class="par">
              <label for="departamento">Departamento</label>
              <select
                id="departamento"
                v-model="dataRef.departamento"
                name="departamento"
                @change="consultarDataGeoRef(dataRef, 'localidades')"
                :disabled="dataRef.departamentos == null"
              >
                <option v-for="name in dataRef.departamentos" :key="name">
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="par">
              <label for="localidad">Localidad</label>
              <select
                id="localidad"
                v-model="dataRef.localidad"
                name="localidad"
                :disabled="dataRef.localidades == null"
              >
                <option v-for="name in dataRef.localidades" :key="name">
                  {{ name }}
                </option>
              </select>
            </div>
            <!-- </div>
            <div v-else-if="tipoBusqueda == 'mapa'" class="mapa">
              <br />
              <p class="info">
                por favor arrastra el marcador donde vivis, y clickea el boton
                buscar, esté completara tu provincia y departamento <br />
                luego completa la correspondiente localidad y los datos de calle
                y altura
              </p>
              <div style="height: 500px">
                <l-map
                  style="height: 100%; width: 100%"
                  minZoom="3"
                  maxZoom="19"
                  zoom="11"
                  :center="center"
                >
                  <l-tile-layer
                    :url="url"
                    :attribution="attribution"
                  ></l-tile-layer>
                  <l-marker v-model:lat-lng="position" :draggable="true">
                  </l-marker>
                </l-map>
              </div>

              <br />
              <p>{{ position.lat }}, {{ position.lng }}</p>
              <div class="btn-common">
                <button @click.prevent="geoRef">Buscar Departamento</button>
              </div>
              <br />
              <div class="contenido">
                <div class="par">
                  <label for="localidad">localidad</label>
                  <select
                    id="localidad"
                    v-model="dataRef.localidad"
                    name="localidad"
                    :disabled="dataRef.localidades == null"
                  >
                    <option v-for="name in dataRef.localidades" :key="name">
                      {{ name }}
                    </option>
                  </select>
                </div>
              </div>
              <p>
                Provincia: {{ dataRef.provincia }} <br />
                Departamento: {{ dataRef.departamento }} <br />
                Localidad: {{ dataRef.localidad }} <br />
                <br />
                <br />
              </p>
            </div> -->
            <div class="par">
              <label for="direccion">Tu direccion (Calle y altura) </label>
              <input
                type="text"
                id="direccion"
                v-model="direccion"
                name="direccion"
                :class="{ revisar: revisiones.direccion }"
              />
              <div v-if="revisiones.direccion">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>
            <br />
            <div class="par">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                name="email"
                :class="{ revisar: revisiones.email }"
              />
              <div v-if="revisiones.email">
                <p>
                  <span class="revisar">
                    Por favor completa el campo correctamente
                  </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="emailConfirmacion">Repita su Email</label>
              <input
                type="emailConfirmacion"
                id="emailConfirmacion"
                v-model="emailConfirmacion"
                name="emailConfirmacion"
                :class="{ revisar: revisiones.emailConfirmacion }"
              />
              <div v-if="revisiones.emailConfirmacion">
                <p>
                  <span class="revisar">
                    Por favor completa el campo correctamente
                  </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="celular">Celular</label>
              <input
                type="tel"
                id="celular"
                v-model="celular"
                name="celular"
                :class="{ revisar: revisiones.celular }"
              />
              <div v-if="revisiones.celular">
                <p>
                  <span class="revisar">
                    Por favor completa el campo correctamente
                  </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="empresaCel">Compañia del Celular</label>
              <select
                id="empresaCel"
                v-model="empresaCel"
                name="empresaCel"
                :class="{ revisar: revisiones.empresaCel }"
              >
                <option
                  v-for="name in listEmpresasCel"
                  :key="name"
                  :value="name"
                >
                  {{ name }}
                </option>
              </select>
              <div v-if="revisiones.empresaCel">
                <p>
                  <span class="revisar">
                    Por favor completa el campo correctamente
                  </span>
                </p>
              </div>
            </div>
            <div v-if="empresaCel == 'Otra'">
              <div class="par">
                <label for="acalracionEmpresa">¿Cual?</label>
                <input type="text" v-model="acalracionEmpresa" />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="datos">
          <h2>Datos Institucionales</h2>
          <h3>Escuela secundaria:</h3>
          <div v-if="revisiones.escuelaSeleccion">
            <p>
              <span class="revisar"> Por favor completa el campo </span>
            </p>
          </div>

          <input
            type="radio"
            id="exterior"
            name="exterior"
            value="exterior"
            v-model="escribirInstitucion"
          />
          <label for="exterior"
            >terminaste el secundario fuera de Argentina</label
          ><br />
          <input
            type="radio"
            id="argen"
            name="argen"
            value="argen"
            v-model="escribirInstitucion"
          />
          <label for="argen">estudias o estudiaste en Argentina</label><br />

          <br />
          <div class="contenido">
            <div
              v-if="escribirInstitucion == 'exterior' && escuelas == null"
              class="opciones"
            >
              <div class="par">
                <label for="iPais">Pais Institucion</label>
                <input
                  type="text"
                  id="iPais"
                  v-model="iPais"
                  name="iPais"
                  :class="{ revisar: revisiones.iPais }"
                />
                <div v-if="revisiones.iPais">
                  <p>
                    <span class="revisar">
                      Por favor completa el pais de la institucion
                    </span>
                  </p>
                </div>
              </div>
              <div class="par">
                <label for="iProvincia">Provincia Institucion</label>
                <input
                  type="text"
                  id="iProvincia"
                  v-model="selected.jurisdiccion"
                  name="iProvincia"
                  :class="{ revisar: revisiones.ProvinciaInsti }"
                />
                <div v-if="revisiones.ProvinciaInsti">
                  <p>
                    <span class="revisar">
                      Por favor completa el pais de la institucion
                    </span>
                  </p>
                </div>
              </div>
              <div class="par">
                <label for="iLocalidad">Localidad Institucion</label>
                <input
                  type="text"
                  id="iLocalidad"
                  v-model="this.selected.localidad"
                  name="iLocalidad"
                />
              </div>

              <div class="par">
                <label for="iNombre">Nombre Institucion</label>
                <input
                  type="text"
                  id="iNombre"
                  v-model="selected.nombre"
                  name="iNombre"
                  :class="{ revisar: revisiones.nombreInsti }"
                />
                <div v-if="revisiones.nombreInsti">
                  <p>
                    <span class="revisar">
                      Por favor completa el nombre de la institucion
                    </span>
                  </p>
                </div>
              </div>
              <div class="par">
                <label for="iSector">Sector (publico o privado)</label>
                <select
                  id="iSector"
                  v-model="selected.sector"
                  name="iSector"
                  :class="{ revisar: revisiones.sector }"
                >
                  <option value="Estatal">publico</option>
                  <option value="Privado">privado</option>
                </select>
                <div v-if="revisiones.sector">
                  <p>
                    <span class="revisar">
                      Por favor completa el pais de la institucion
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div v-else-if="escribirInstitucion == 'argen'" class="opciones">
              <div class="par">
                <label for="iProvincia">Provincia Institucion</label>
                <select
                  id="iProvincia"
                  v-model="dataInsti.provincia"
                  name="iProvincia"
                  @change="consultarDataGeoRef(dataInsti, 'departamentos')"
                >
                  <option v-for="name in listaProv" :key="name">
                    {{ name }}
                  </option>
                </select>
              </div>
              <div class="par">
                <label for="iDepartamento">departamento</label>
                <select
                  id="iDepartamento"
                  v-model="dataInsti.departamento"
                  name="iDepartamento"
                  :disabled="dataInsti.departamentos == null"
                >
                  <option v-for="name in dataInsti.departamentos" :key="name">
                    {{ name }}
                  </option>
                </select>
              </div>
              <div class="btn-common">
                <button @click.prevent="consulta">Buscar escuelas</button>
              </div>
              <br />

              <div v-if="revisiones.escuela">
                <p>
                  <span class="revisar">
                    Por favor completa busca tu escuela
                  </span>
                </p>
              </div>
              <div v-if="escuelas != null" class="opciones">
                <div class="celular">
                  <label for="contiene"
                    >escribe tres o mas letras del nombre o la direccion para
                    filtrar la lista</label
                  >
                  <input v-model="contiene" name="contiene" />
                  <br />
                </div>
                <select size="10" v-model="selected" class="selector">
                  <option
                    v-for="name in filteredNames"
                    :key="name"
                    :value="name"
                  >
                    {{ name.nombre }} <span> | </span> {{ name.domicilio }}
                  </option>
                </select>
                <p class="escuela">
                  <br />
                  Nombre: <b>{{ selected.nombre }} </b><br />
                  Direccion: <b> {{ selected.domicilio }}</b>
                </p>
              </div>
              <div v-else-if="buscando">
                <p>
                  aguarda que cargue, la busqueda puede demorar unos segundos
                </p>
              </div>
            </div>

            <br />
            <!--                 :class="{ erase: this.escribirInstitucion == 'exterior' }"
 -->
            <div :class="{ par: this.escribirInstitucion != 'exterior' }">
              <div v-if="escribirInstitucion != 'exterior'">
                <label for="cursandoSecu"
                  >¿Estás cursando actualmente el último año de
                  secundario?</label
                >
                <select
                  id="cursandoSecu"
                  v-model="cursandoSecu"
                  name="cursandoSecu"
                >
                  <option value="si">si</option>
                  <option value="no">no</option>
                </select>
              </div>
            </div>

            <div class="par">
              <div
                v-if="cursandoSecu == 'no' || escribirInstitucion == 'exterior'"
              >
                <label for="fechaFinSecu"
                  >cuando terminaste el secundario</label
                >
                <input
                  type="month"
                  id="fechaFinSecu"
                  v-model="fechaFinSecu"
                  name="fechaFinSecu"
                />
              </div>
            </div>
            <div class="par">
              <label for="queresIngresar"
                >¿pensas incribirte en el primer año de la UTN?</label
              >
              <select
                id="queresIngresar"
                v-model="queresIngresar"
                name="queresIngresar"
              >
                <option value="si">si</option>
                <option value="no">no</option>
                <option value="tal vez">tal vez</option>
              </select>
            </div>
            <div class="par">
              <label for="seminarioRecursante "
                >¿Realizaste el Seminario intensivo de ingreso a la UTN en años
                anteriores?
              </label>
              <select
                id="seminarioRecursante"
                v-model="seminarioRecursante"
                name="seminarioRecursante"
              >
                <option value="si">si</option>
                <option value="no">no</option>
              </select>
            </div>
          </div>
        </div>
        <br />
        <div class="datos">
          <h2>Datos Madre / Padre / Tutor</h2>
          <div class="contenido">
            <div class="par">
              <label for="tNombre">Nombre</label>
              <input
                type="text"
                id="tNombre"
                v-model="tNombre"
                name="tNombre"
                :class="{ revisar: revisiones.tNombre }"
              />
              <div v-if="revisiones.tNombre">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="tApellido">Apellido</label>
              <input
                type="text"
                id="tApellido"
                v-model="tApellido"
                name="tApellido"
                :class="{ revisar: revisiones.tApellido }"
              />
              <div v-if="revisiones.tApellido">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="tEmail">Email</label>
              <input
                type="email"
                id="tEmail"
                v-model="tEmail"
                name="tEmail"
                :class="{ revisar: revisiones.tEmail }"
              />
              <div v-if="revisiones.nombreInsti">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="tTelefono">Telefono</label>
              <input
                type="tel"
                id="tTelefono"
                v-model="tTelefono"
                name="tTelefono"
                :class="{ revisar: revisiones.tTelefono }"
              />
              <div v-if="revisiones.tTelefono">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>
            <div class="par">
              <label for="familiaEstudios"
                >¿Tu Madre / Padre / Tutor, cursaron o finalizaron una carrera
                universitaria?
              </label>
              <select
                id="familiaEstudios"
                v-model="familiaEstudios"
                name="familiaEstudios"
                :class="{ revisar: revisiones.familiaEstudios }"
              >
                <option value="si">si</option>
                <option value="no">no</option>
              </select>
              <div v-if="revisiones.familiaEstudios">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="datos">
          <h1>Otros Datos</h1>
          <div class="contenido">
            <div class="par">
              <label for="diponibilidad"
                >Seleccione su disponibilidad horaria para cursar el programa,
                de quedar seleccionado</label
              >
              <select
                id="diponibilidad"
                v-model="diponibilidad"
                name="diponibilidad"
                :class="{ revisar: revisiones.diponibilidad }"
              >
                <option
                  v-for="name in listaDisponibilidad"
                  :key="name"
                  :value="name"
                >
                  {{ name }}
                </option>
              </select>
              <div v-if="revisiones.diponibilidad">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>
            <br />
            <div class="par">
              <label for="trabajo">¿Trabajas?</label>
              <select
                id="trabajo"
                v-model="trabajo"
                name="trabajo"
                :class="{ revisar: revisiones.trabajo }"
              >
                <option v-for="name in listaTrabajo" :key="name" :value="name">
                  {{ name }}
                </option>
              </select>
              <div v-if="revisiones.trabajo">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>

            <div class="par">
              <label for="viviendaPropia">¿Contás con vivienda propia? </label>
              <select
                id="viviendaPropia"
                v-model="viviendaPropia"
                name="viviendaPropia"
                :class="{ revisar: revisiones.viviendaPropia }"
              >
                <option value="si">si</option>
                <option value="no">no</option>
              </select>
              <div v-if="revisiones.viviendaPropia">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>

            <div class="par">
              <label for="conectividad">¿Tenés internet en tu casa?</label>
              <select
                id="conectividad"
                v-model="conectividad"
                name="conectividad"
                :class="{ revisar: revisiones.conectividad }"
              >
                <option
                  v-for="name in ListaConectividad"
                  :key="name"
                  :value="name"
                >
                  {{ name }}
                </option>
              </select>
              <div v-if="revisiones.conectividad">
                <p>
                  <span class="revisar"> Por favor completa el campo </span>
                </p>
              </div>
            </div>

            <div class="par">
              <label for="refEntropia">¿Cómo conociste el programa? </label>
              <select
                id="refEntropia"
                v-model="referenciaEntropia"
                name="refEntropia"
              >
                <option
                  v-for="name in listaRefEntropia"
                  :key="name"
                  :value="name"
                >
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="par">
              <div v-if="referenciaEntropia == 'OTRO'">
                <label for="aclaracionEntropia">¿Cual?</label>
                <input
                  type="text"
                  v-model="aclaracionEntropia"
                  name="aclaracionEntropia"
                />
              </div>
            </div>
          </div>
        </div>

        <button class="btn" @click.prevent="validarForm">
          ENVIAR FORMULARIO
        </button>
      </form>

      <transition name="modal">
        <modal v-if="showModal" @close="showModal = false" :msg="msg" />
      </transition>
    </div>
  </div>
</template>

<script>
import git from "firebase/compat/app";
import "firebase/compat/firestore";
import "leaflet/dist/leaflet.css";
// import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import modal from "./components/modal.vue";

firebase.initializeApp({
  projectId: process.env.VUE_APP_PROJECTID,
  appId: process.env.VUE_APP_APPID,
});

var firestore = firebase.firestore();

var db = firestore.collection("ingresantes");

export default {
  name: "App",
  components: {
    // LMap,
    // LTileLayer,
    // LMarker,
    modal,
  },
  data() {
    return {
      showModal: false,
      revisiones: {
        nombre: false,
        apellido: false,
        email: false,
        emailConfirmacion: false,
        tipoDocumento: false,
        documento: false,
        fechaNacimiento: false,
        sexoBio: false,
        escuelaSeleccion: false,
        nombreInsti: false,
        ProvinciaInsti: false,
        direccion: false,
        provincia: false,
        departamento: false,
        localidad: false,
        celular: false,
        empresaCel: false,
        familiaEstudios: false,
        tTelefono: false,
        tEmail: false,
        tApellido: false,
        tNombre: false,
        diponibilidad: false,
        iPais: false,
        trabajo: false,
        viviendaPropia: false,
        conectividad: false,
      },
      msg: "",
      // attribution: //valores del mapa
      //   '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      // url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      // zoom: 3,
      // center: [-34.65993406935912, -58.46778921133085],
      // position: [-34.65993406935912, -58.46778921133085],
      // //----------------------
      // tipoBusqueda: "buscador",
      escribirInstitucion: null,
      escuelas: null,
      selected: {
        email: null,
        cue: null,
        ambito: null,
        codigoPostal: null,
        departamento: null,
        nombre: null,
        codigoDepartamento: null,
        telefono: null,
        jurisdiccion: null,
        domicilio: null,
        localidad: null,
        codigoTelefonico: null,
        anexoCue: null,
        codigoLocalidad: null,
        sector: null,
      },
      contiene: "",
      first: "",
      last: "",
      //---
      listaTrabajo: ["FULL TIME", "PART TIME", "NO TRABAJO"],
      listaDisponibilidad: [
        "Solo Sabado 09hs a 13hs",
        "Solo Sabado 13hs a 17hs",
        "Tengo disponibilidad en ambos horarios",
      ],
      ListaConectividad: ["WIFI", "CABLE MODEM", "DATOS MÓVILES", "NO"],
      listaRefEntropia: [
        "REFERENTE DE LA ESCUELA",
        " UN COMPAÑERO/A",
        "UN FAMILIAR",
        "REDES",
        "WEB",
        "OTRO",
      ],
      listEmpresasCel: ["Movistar", "Personal", "Claro", "Tuenti", "Otra"],
      //----------------------
      listaProv: [
        "Ciudad de Buenos Aires",
        "Buenos Aires",
        "Catamarca",
        "Córdoba",
        "Corrientes",
        "Chaco",
        "Chubut",
        "Entre Ríos",
        "Formosa",
        "Jujuy",
        "La Pampa",
        "La Rioja",
        "Mendoza",
        "Misiones",
        "Neuquén",
        "Río Negro",
        "Salta",
        "San Juan",
        "San Luis",
        "Santa Cruz",
        "Santa Fe",
        "Santiago del Estero",
        "Tucumán",
        "Tierra del Fuego",
      ],
      dataRef: {
        provincia: null,
        departamento: null,
        localidad: null,
        departamentos: null,
        localidades: null,
      },
      dataInsti: {
        provincia: null,
        departamento: null,
        departamentos: null,
      },
      //----
      envioForm: false,
      respuesta: null,
      fallaComunicacionApi: false,
      buscando: false,
      //-----
      y: "",
      x: "",
      ////////////////////////////
      ///////// variables de formulario ////////
      ////////////////////////
      nombre: null,
      apellido: null,
      tipoDocumento: null,
      documento: null,
      fechaNacimiento: null,
      edad: null,
      sexoBio: null,
      direccion: null,
      provincia: null,
      localidad: null,
      email: null,
      emailConfirmacion: null,
      celular: null,
      empresaCel: null,
      acalracionEmpresa: null,
      //---------------
      iPais: null,
      cursandoSecu: null,
      queresIngresar: null,
      seminarioRecursante: null,
      //------------------------------------
      viviendaPropia: null,
      trabajo: null,
      diponibilidad: null,
      conectividad: null,
      referenciaEntropia: null,
      aclaracionEntropia: null,
      //----------------
      familiaEstudios: null,
      fechaFinSecu: null,
      seminarioRecurs: null,
      tNombre: null,
      tApellido: null,
      tEmail: null,
      tTelefono: null,
      //------------
    };
  },

  computed: {
    filteredNames() {
      return this.escuelas.filter((n) =>
        n.nombre.toLowerCase().includes(this.contiene.toLowerCase())
      );
    },
  },

  methods: {
    async consulta() {
      this.buscando = true;
      const nombreCollections = {
        "Ciudad de Buenos Aires": "caba",
        "Buenos Aires": "buenosAires",
        Catamarca: "catamarca",
        Córdoba: "cordoba",
        Corrientes: "corrientes",
        Chaco: "chaco",
        Chubut: "chubut",
        "Entre Ríos": "entreRios",
        Formosa: "formosa",
        Jujuy: "jujuy",
        "La Pampa": "laPampa",
        "La Rioja": "laRioja",
        Mendoza: "mendoza",
        Misiones: "misiones",
        Neuquén: "neuquen",
        "Río Negro": "rioNegro",
        Salta: "salta",
        "San Juan": "sanJuan",
        "San Luis": "sanLuis",
        "Santa Cruz": "santaCruz",
        "Santa Fe": "santaFe",
        "Santiago del Estero": "santiagoDelEstero",
        Tucumán: "tucuman",
        "Tierra del Fuego": "tierraDelFuego",
      };
      var consultar = firestore.collection(
        nombreCollections[this.dataInsti.provincia]
      );
      var depa = "";

      if (this.dataInsti.provincia == "Ciudad de Buenos Aires") {
        depa = this.dataInsti.departamento;
      } else if (this.dataInsti.departamento == "José M. Ezeiza") {
        //esto tendria que enmendarlo via un dict para los 15 casos presentes (realizar a futuro)
        depa = "EZEIZA";
      } else {
        depa = this.dataInsti.departamento
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase();
      }

      const snapshot = await consultar
        .where("jurisdiccion", "==", `${this.dataInsti.provincia}`)
        .where("departamento", "==", `${depa}`)
        .get();
      if (snapshot.empty) {
        console.log("No se encontro documento.");
        return;
      }
      this.escuelas = [];
      snapshot.forEach((doc) => {
        this.escuelas.push(doc.data());
      });
      this.escuelas.sort(function (a, b) {
        return a.nombre.localeCompare(b.nombre);
      });
    },

    getEdad(fecha) {
      let hoy = new Date();
      let fechaNac = new Date(fecha);
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      let diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();
      if (
        diferenciaMeses < 0 ||
        (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())
      ) {
        edad--;
      }
      return edad;
    },

    async geoRef() {
      //quizas ya es otra mala practica no colocar lat y lng como parametros
      try {
        const response = await fetch(
          `https://apis.datos.gob.ar/georef/api/ubicacion?lat=${this.position.lat}&lon=${this.position.lng}`
        );
        const data = await response.json();
        this.dataRef.provincia = data.ubicacion.provincia.nombre;
        this.dataRef.departamento = data.ubicacion.departamento.nombre;
        this.dataRef.localidad = null;
        this.consultarDataGeoRef(this.dataRef, "localidades");
      } catch (e) {
        console.error(e);
      }
    },

    async consultarDataGeoRef(listaDestino, escala) {
      //a que hace referencia Mod
      let datos = "";
      if (escala == "departamentos") {
        datos = `provincia=${listaDestino.provincia}`;
      }
      if (escala == "localidades") {
        datos = `provincia=${listaDestino.provincia}&departamento=${listaDestino.departamento}`;
      }
      try {
        const response = await fetch(
          `https://apis.datos.gob.ar/georef/api/${escala}?${datos}&max=5000`
        );
        const data = await response.json();
        var lista = [];
        data[escala].forEach(function (dat) {
          lista.push(dat["nombre"]);
        });

        listaDestino[escala] = lista.sort();
        //cambios para aplicar a futuro
        // if (
        //   escala == "departamentos" &&
        //   listaDestino.provincia != "Ciudad de Buenos Aires"
        // ) {
        //   const correccion = [
        //     "EZEIZA",
        //     "CORONEL DE MARINA L ROSALES",
        //     "1§ DE MAYO",
        //     "O HIGGINS",
        //     "MAYOR LUIS J FONTANA",
        //     "DOCTOR MANUEL BELGRANO",
        //     "GENERAL ANGEL V PEÑALOZA",
        //     "GENERAL JUAN F QUIROGA",
        //     "LIBERTADOR GRL SAN MARTIN",
        //     "GENERAL JUAN MARTIN DE PUEYRREDON",
        //     "CONSTITUCION",
        //     "JUAN F IBARRA",
        //     "JUAN B ALBERDI",
        //   ];
        //   correccion.forEach(function (distrito) {
        //     lista.push(distrito);
        //   });
        // }
      } catch (e) {
        console.error(e);
      }
    },
    validarForm() {
      //funcion de carteles para revisar informacion
      this.revisiones = {
        nombre: false,
        apellido: false,
        email: false,
        emailConfirmacion: false,
        tipoDocumento: false,
        documento: false,
        fechaNacimiento: false,
        sexoBio: false,
        escuelaSeleccion: false,
        nombreInsti: false,
        ProvinciaInsti: false,
        direccion: false,
        provincia: false,
        departamento: false,
        localidad: false,
        celular: false,
        empresaCel: false,
        familiaEstudios: false,
        tTelefono: false,
        tEmail: false,
        tApellido: false,
        tNombre: false,
        diponibilidad: false,
        iPais: false,
        trabajo: false,
        viviendaPropia: false,
        conectividad: false,
      };

      //----- revision datos email
      const reg =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
      let enviar = true;
      let mensaje = [];
      if (this.email != null) {
        if (!this.validar(this.email.replace(/\s/g, ""), reg)) {
          mensaje.push("No has escrito bien tu mail\n");
          this.revisiones.email = true;
          this.revisiones.emailConfirmacion = true;
          enviar = false;
        }
        if (this.emailConfirmacion != null) {
          if (
            this.email.replace(/\s/g, "") !=
            this.emailConfirmacion.replace(/\s/g, "")
          ) {
            mensaje.push("La cornfirmacion del mail no coincide\n");
            this.revisiones.emailConfirmacion = true;
            enviar = false;
          }
        } else {
          mensaje.push("no has escrito la confirmacion del mail\n");
          this.revisiones.emailConfirmacion = true;
          enviar = false;
        }
      } else {
        mensaje.push("no ha escrito el mail\n");
        this.revisiones.email = true;
        this.revisiones.emailConfirmacion = true;

        enviar = false;
      }

      //----- revision datos escuela

      if (this.iPais == null && this.escribirInstitucion == "exterior") {
        mensaje.push("el campo de pais a quedado vacio\n");
        enviar = false;
        this.revisiones.iPais = true;
      }
      if (
        this.selected.nombre == null &&
        this.escribirInstitucion == "exterior"
      ) {
        mensaje.push("el campo de nombre de la intitucion a quedado vacio\n");
        enviar = false;
        this.revisiones.nombreInsti = true;
      }
      if (
        this.selected.jurisdiccion == null &&
        this.escribirInstitucion == "exterior"
      ) {
        mensaje.push("el campo de Provincia a quedado vacio\n");
        enviar = false;
        this.revisiones.ProvinciaInsti = true;
      } else if (
        this.selected.sector == null &&
        this.escribirInstitucion == "argen"
      ) {
        mensaje.push("no has completado tu escuela \n");
        enviar = false;
        this.revisiones.escuela = true;
      } else if (this.escribirInstitucion == null) {
        mensaje.push("no has completado tu escuela \n");
        enviar = false;
        this.revisiones.escuelaSeleccion = true;
      }

      //----- revision datos personales

      if (this.nombre == null) {
        mensaje.push("el campo de nombre a quedado vacio\n");
        enviar = false;
        this.revisiones.nombre = true;
      }
      if (this.apellido == null) {
        mensaje.push("el campo de apellido a quedado vacio\n");
        enviar = false;
        this.revisiones.apellido = true;
      }
      if (this.tipoDocumento == null) {
        mensaje.push("el campo de tipo de documento a quedado vacio\n");
        enviar = false;
        this.revisiones.tipoDocumento = true;
      }
      if (this.documento == null) {
        mensaje.push("el campo de documento a quedado vacio\n");
        enviar = false;
        this.revisiones.documento = true;
      }
      if (this.fechaNacimiento == null) {
        mensaje.push("el campo de edad a quedado vacio\n");
        enviar = false;
        this.revisiones.fechaNacimiento = true;
      }
      if (this.sexoBio == null) {
        mensaje.push("el campo de sexo biologico a quedado vacio\n");
        enviar = false;
        this.revisiones.sexoBio = true;
      }
      if (this.direccion == null) {
        mensaje.push("el campo de direccion a quedado vacio\n");
        enviar = false;
        this.revisiones.direccion = true;
      }

      if (this.dataRef.localidad == null) {
        mensaje.push("el campo de localidad a quedado vacio\n");
        enviar = false;
        this.revisiones.localidad = true;
      }
      if (this.dataRef.departamento == null) {
        mensaje.push("el campo de direccion  a quedado vacio\n");
        enviar = false;
        this.revisiones.departamento = true;
      }
      if (this.dataRef.provincia == null) {
        mensaje.push("el campo de direccion  a quedado vacio\n");
        enviar = false;
        this.revisiones.provincia = true;
      }
      if (this.celular == null) {
        mensaje.push("el campo del numero de celular a quedado vacio\n");
        enviar = false;
        this.revisiones.celular = true;
      }

      if (this.empresaCel == null) {
        mensaje.push("el campo de la empreas del celular a quedado vacio\n");
        enviar = false;
        this.revisiones.empresaCel = true;
      }
      //----- revision datos Tutor
      if (this.tNombre == null) {
        mensaje.push(
          "el campo de nombre de Madre / Padre / Tutor a quedado vacio\n"
        );
        enviar = false;
        this.revisiones.tNombre = true;
      }
      if (this.tApellido == null) {
        mensaje.push(
          "el campo de apellido de Madre / Padre / Tutor a quedado vacio\n"
        );
        enviar = false;
        this.revisiones.tApellido = true;
      }

      if (this.tEmail == null) {
        mensaje.push(
          "el campo del Mail de Madre / Padre / Tutor a quedado vacio\n"
        );
        enviar = false;
        this.revisiones.tEmail = true;
      } else {
        if (!this.validar(this.tEmail.replace(/\s/g, ""), reg)) {
          mensaje.push(
            "No has escrito bien el mail de tu Madre / Padre / Tutor \n"
          );
          this.revisiones.tEmail = true;
          enviar = false;
        }
      }

      if (this.tTelefono == null) {
        mensaje.push(
          "el campo de Telefono de Madre / Padre / Tutor a quedado vacio\n"
        );
        enviar = false;
        this.revisiones.tTelefono = true;
      }
      if (this.familiaEstudios == null) {
        mensaje.push(
          "el campo de ¿Tu Madre / Padre / Tutor, cursaron o finalizaron una carrera universitaria? a quedado vacio\n"
        );
        enviar = false;
        this.revisiones.familiaEstudios = true;
      }

      //----- revision otros datos
      if (this.diponibilidad == null) {
        mensaje.push("el campo de diponibilidad a quedado vacio\n");
        enviar = false;
        this.revisiones.diponibilidad = true;
      }
      if (this.trabajo == null) {
        mensaje.push("el area de trabajo a quedado vacio\n");
        enviar = false;
        this.revisiones.trabajo = true;
      }

      if (this.viviendaPropia == null) {
        mensaje.push("el campo de vivienda a quedado vacio\n");
        enviar = false;
        this.revisiones.viviendaPropia = true;
      }
      if (this.conectividad == null) {
        mensaje.push("el campo de conectividad a quedado vacio\n");
        enviar = false;
        this.revisiones.conectividad = true;
      }

      if (enviar) {
        let confirmaDocumento = confirm(
          "ESTE ES TU DOCUMENTO: ".concat(this.documento)
        );
        let confirmaEmail = confirm("ESTE ES TU EMAIL: ".concat(this.email));
        if (confirmaEmail && confirmaDocumento) {
          this.enviar();
        } else {
          alert("porfavor corrigelo");
        }
      } else {
        this.msg = mensaje;
        this.showModal = true;
      }
    },
    validar(cadena, expresion) {
      return expresion.test(cadena);
    },
    enviar() {
      this.envioForm = true;
      const dominioApi = "https://################";
      fetch(`${dominioApi}?documento=${this.documento}&email=${this.email}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.unico); //cambiar nombre de la variable en la api?

          if (this.escribirInstitucion == "exterior") {
            this.cursandoSecu = "no";
          }
          if (data.unico) {
            const datosForm = {
              nombre: this.nombre.toUpperCase(),
              apellido: this.apellido.toUpperCase(),
              tipoDocumento: this.tipoDocumento,
              documento: this.documento.replace(/[^0-9]/g, ""),
              fechaNacimiento: this.fechaNacimiento,
              edad: this.getEdad(this.fechaNacimiento),
              sexoBio: this.sexoBio,
              direccion: this.direccion,
              provincia: this.dataRef.provincia,
              departamento: this.dataRef.departamento,
              localidad: this.dataRef.localidad,
              email: this.email.replace(/\s/g, ""),
              celular: this.celular.replace(/[^0-9]/g, ""),
              empresaCel: this.empresaCel,
              acalracionEmpresa: this.acalracionEmpresa,
              ////////////
              iPais: this.iPais,
              iProvincia: this.selected.jurisdiccion,
              iLocalidad: this.selected.localidad,
              iDepartamento: this.selected.departamento,
              iNombre: this.selected.nombre,
              anexoCue: this.selected.anexoCue,
              iSector: this.selected.sector,
              iEmail: this.selected.email,
              cue: this.selected.cue,
              iAmbito: this.selected.ambito,
              iCodigoPostal: this.selected.codigoPostal,
              iCodigoDepa: this.selected.codigoDepartamento,
              Itelefono: this.selected.telefono,
              iDomicilio: this.selected.domicilio,
              iCodigoTel: this.selected.codigoTelefonico,
              iCodigoLocal: this.selected.codigoLocalidad,
              //////////
              cursandoSecu: this.cursandoSecu,
              queresIngresar: this.queresIngresar,
              familiaEstudios: this.familiaEstudios,
              fechaFinSecu: this.fechaFinSecu,
              seminarioRecurs: this.seminarioRecursante,
              ////////////
              tNombre: this.tNombre.toUpperCase(),
              tApellido: this.tApellido.toUpperCase(),
              tEmail: this.tEmail.replace(/\s/g, ""),
              tTelefono: this.tTelefono.replace(/[^0-9]/g, ""),
              //-----
              viviendaPropia: this.viviendaPropia,
              trabajo: this.trabajo,
              diponibilidad: this.diponibilidad,
              conectividad: this.conectividad,
              referenciaEntropia: this.referenciaEntropia,
              aclaracionEntropia: this.aclaracionEntropia,
              //////////////////
              creadoEn: firebase.firestore.Timestamp.now().toDate(),
            };
            // Carga a la db
            db.doc()
              .set(datosForm)
              .then(() => {
                console.log("Data saved");
                this.respuesta = true;
                alert("SU FORMULARIO HA SIDO RECIBIDO SATISFACTORIAMENTE ");
              })
              .catch((error) => {
                console.log(error);
                this.respuesta = false;
                alert("ha ocurrido un error no se ha podido finalizar");
              });
          } else {
            this.respuesta = false;
            alert(
              "sus datos personales ya se encuentran en el registro, hemos denegado la carga "
            );
          }
        })
        .catch((error) => {
          console.log(error);
          this.fallaComunicacionApi = true; // modificar esto
          alert(
            "ha ocurrido un error al comunicarnos con el servidor, trate de completarlo mas tarde"
          );
        });
    },
  },
};
</script>

<style scoped>
@import "style.css";
</style>
