# Prueba Técnica Realiza para Alegra #
Para esta prueba, se desarrolló una REST API basada en microservicios, corriendo en la nube de AWS y usando DynamoDB para persistir los datos; se útlizo el patrón de diseño Model-View-Controller para gestiónar las rutas, lo controladores y los datos retonardos a los clientes de forma óptima y escalable
## Links 🔗 ##
A continuación, se listan los links de servicio de la API y de la interfaz gráfica
1. API: *https://1dobvidpv4.execute-api.sa-east-1.amazonaws.com/alegra-test*
2. Interfaz Gráfica: *http://alegra-test-interface.s3-website-sa-east-1.amazonaws.com*
3. 
## Endpoints 💻 ##
La arquitectura de la REST API está basada en microservicios, que serán descritos posteriormente, estos son: **kitchen** y **warehouse**, los endpoints para cada uno de ellos se listan a continuación
### La cocina 🍳 [kitchen] ###
#### 🥩 **/api/kitchen/make-dish** ####
[GET] en este endpoint, el cliente puede realizar una petición para crear un plato (aleatorio) entre los disponibles en el menú para la jornada de almuerzos gratis, el controlador de la cocina realiza, *grosso modo* los siguientes pasos
1. Creación de plato aletorio
2. Petición al microservicio de la bodega de los ingredientes necesarios para cocinar el plato
3. Cocinar el plato con los ingredientes entregados por la bodega
4. Actualizar el estado del plato a entregado (delivered = true)
5. Retornar el plato escogido en el punto 1. al cliente

#### 🖨 **/api/kitchen/dish-history** ####
[GET] En este endpoint, el cliente puede hacer la petición para consultar en la base de datos todos los platos que la cocina ha recibido para preparar, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad Dish
2. Retorna la lista al cliente

#### 🎡 **/api/kitchen/dish-queue** ####
[GET] En este endpoint, el cliente puede hacer la petición para consultar en la base de datos los platos que aun no han sido cocinados, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos de entidad Dish con atributo delivered = false
2. Retorna la lista al cliente

Nota: El parametro [limit] puede ser ingresado como un parametro query para limitar la cantidad de elementos mostrados, por defecto, ésta cantidad corresponde a los últimos 20 registros.

#### 🥧 **/api/kitchen/menu** ####
[GET] En este endpoint, el cliente puede hacer la petición para consultar en la base de datos el menu disponible, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad menu
2. Retorna la lista al cliente

Nota: El parametro query [limit] puede ser también usado en este endpoint

### La bodega 🏠 [warehouse] ###

#### 🍖 **/api/warehouse/get-ingredients** ####
[POST] Este es el endpoint que dispone el microservicio de la bodega para recibir las peticiones de los ingredientes que necesita la cocina, retornarndo la cantidad necesaria para preparar el plato, el controlador del microservicio realiza los siguientes pasos para llevar a cabo la petición
1. Consulta en la base de datos del stock disponible
2. Comparación entre el stock disponible y los ingredientes solicitados
3. En caso de haber défict en alguno de los ingredientes, el controlador crea una orden de compra de dicho ingrediente a la plaza de mercado
4. Si la cantidad comprada es igual a cero o es inferior a la cantidad requerida por el pedido, el controlador repite la petición las veces que sea necesaria (acumulando los valores comprados anteriormente)
5. Si la cantidad comprada es superior, el controlador guarda en el stock el restante
7. Se actualiza la base de datos con la entidad Stock y el id v1, que corresponde con el stock de la bodega en la base de datos
8. Retorna los ingredientes solicitados a la cocina

*Importante*: Este endpoint require una ApiKey para poder hacer la solicitud, cargada en los headers de la solicitud del microservicio de la cocina. Además, el microservicio de la bodega sólo recibira pedidos de los ingredientes registrados en el reto

#### 🖨 **/api/warehouse/orders-history** ####
[GET] En este endpoint el microservicio de la bodega consulta a la base de datos el historial de órdenes de compra, siendo éstas almacenadas cuando la compra es éxitosa, es decir, cuando la cantidad comprada a la plaza de mercado es diferente de cero. Para la consulta, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad OrderIngredient
2. Retorna la lista al cliente

Nota: El parametro limit puede ser ingresado como un parametro query para limitar la cantidad de elementos mostrados, por defecto, ésta cantidad corresponde a los últimos 20 registros.

#### 🎫 **/api/warehouse/stock** ####
[GET] Aquí, el cliente puede consultar el stock disponible en la base de datos en el momento de la consulta, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad Stock
2. Retorna la lista al cliente

####
Nota: Para el cliente es transparente la infraestructura de los microservicios
## Microservicios 🐳 ##
### kitchen 🍳 ###
#### env 🧪####
### warehouse 🏠 ###
#### env 🧪####
## Base de Datos ⚙ ##
#### Stock ####
#### menu ####
## Deploy 🎇 ##
