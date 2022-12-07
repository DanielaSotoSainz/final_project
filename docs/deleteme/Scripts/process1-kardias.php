<?php

/* variables de Asunto e Email a enviar*/

	$asunto = 'Mensaje Healthy Homes';
	$webMaster = 'info@healthyhomesmexico.com';
	
/* recopilar info*/	

	$nombre = $_POST['Nombre'];
	$correoelectronico = $_POST['Correo_Electronico'];
	$empresa = $_POST['Empresa'];
	$mensaje = $_POST['Mensaje'];
	$servicio = $_POST['Servicio'];
	
	$body = <<<EOD
<br><hr><br>
Nombre: $nombre <br>
Correo_Electronico: $correoelectronico <br>
Empresa: $empresa <br>
Mensaje: $mensaje <br>
Servicio:$servicio <br>


EOD;

	$headers = "From: $correoelectronico\r\n";
	$headers .= "Content-type: text/html\r\n";
	$success = mail ($webMaster, $asunto, $body, 
$headers);

/* resultados como HTML*/		

	$theResults = <<<EOD
<html>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Mensaje : Healthy Homes MX</title>
<style type="text/css">


body {
	background-color: #333;
	text-align: right;
}
.letra {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 16px;
	text-align: right;
}
.letrachica {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	font-weight: normal;
	text-align: center;
}
.letrachicarojo {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	color: #F00;
}
.letrachicanegrita {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	font-weight: bolder;
	color: #333;
}
.grisletra {
	color: #666;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 16px;
}
.letrachicagris {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	color: #333;
}
.letra {
	text-align: center;
}
.letramuychica {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
}
.fronttable {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 14px;
	line-height: normal;
	text-indent: 0px;
	background-image: url(/fwd-inmobiliaria/imagenes%20FWD-inmobiliaria/contacto/back_contacto.jpg);
}
.fronttable2 {
	text-indent: 30px;
}

.fondo {
	background-repeat: no-repeat;
}
.style1 {
	font-family: Arial, Helvetica, sans-serif;
	line-height: 5px;
	font-size: 14px;
	text-indent: 35px;
}
.billboard {
	top: 200px;
	position: absolute;
	right: 300px;
	width: 150px;
	background-image: url(/fwd-inmobiliaria/imagenes%20FWD-inmobiliaria/nosotros/png.png);
}
.textindent {
	text-indent: 50px;
}
.billboard1 {	top: 200px;
	position: absolute;
	right: 300px;
	width: 150px;
	background-image: url(/fwd-inmobiliaria/imagenes%20FWD-inmobiliaria/nosotros/png.png);
	text-align: right;
}
.alignsubmit {
	text-align: right;
}
.letrachica tr td .fondo {
	text-align: left;
}
.letrachica tr td .fondo {
	text-align: center;
}
.letrachica tr td .fondo {
	text-align: left;
}
.letrachica tr td .fondo tr .fronttable2 #form1 .fronttable tr td p {
	font-size: x-small;
}
.letrachica tr td .fondo tr .fronttable2 #form1 .fronttable tr td {
}
</style>
<style type="text/css">


#apDiv1 {
	position:absolute;
	width:600px;
	height:70px;
	z-index:1;
	left: 314px;
	top: 230px;
}
</style>
</head>

<body>
<table width="200" border="0" align="center"> 
<tr>  </tr>
</table>
<table width="764" border="0" align="center" class="letrachica">
  <tr align="left">
    <td width="801" bgcolor="#FFFFFF"><table width="764" border="0" class="fondo"> 
      <tr>
        <td width="767"><img src="../imageneshealthyhomes/healthyhomes_topbanner.jpg" width="764" height="95" usemap="#Map" border="0" /></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td><div align="center">
<p>&nbsp;</p>
<p>&nbsp;</p>
        </div></td>
      </tr>
      <tr>
        <td><div align="center"></div></td>
      </tr>
      <tr>
        <td><div align="center">
          <p>Su mensaje ha sido enviado.</p>
          <p>Gracias por su preferencia</p>
        </div></td>
      </tr>
      <tr>
        <td><p align="center">&nbsp;</p>
          <p align="center">&nbsp;</p>
          <p align="center">&nbsp;</p>
          <p align="center">&nbsp;</p>
          <p align="center">&nbsp;</p>
          <p align="center">&nbsp;</p>
          <p align="center">&nbsp;</p>
          <p align="center">&nbsp;</p>
          <p align="center">&copy; Copyright . Healthy Homes México</p></td>
      </tr>


    </table></td>
  </tr>
  
  
</table>
<p>&nbsp; </p>

<map name="Map" id="Map">
  <area shape="rect" coords="282,38,498,61" href="index.html" />
</map>
</body>
</html>

EOD;

echo "$theResults";

?>