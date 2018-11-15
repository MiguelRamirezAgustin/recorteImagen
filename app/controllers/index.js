var ImageFactory = require('ti.imagefactory');
var seleccionarImagen = false;
var image;
var movimiento=0;
var contadorF=1;
var contadorE=1;


var viewImg = Ti.UI.createImageView({
	height: '78%', //480  80
	width: '83%',    //350   85
	backgroundColor: "#F0FFFF",
	borderRadius: 10,
	borderWidth: 1,
	borderColor: "white",
	top: "17%"
});
$.viewImage.add(viewImg);

/*Abrir Galeria y mostar foto*/ 
function AbrirGaleria() {
	Titanium.Media.openPhotoGallery({
		//mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
		success: function (event) {
			var intent =Ti.Android.createIntent({
                action : "com.android.camera.action.CROP",
				data:event.media.nativePath,
				type:'image/*'
			});
			intent.putExtra("outputX", 300);
            intent.putExtra("outputY", 300);
            intent.putExtra("aspectX", 0);
            intent.putExtra("aspectY", 0);
            intent.putExtra("scale", true);
            intent.putExtra("return-data", true);
         
			var activity = $.index.getActivity();
			activity.startActivityForResult(intent, function(param){
				if (param.resultCode == Ti.Android.RESULT_OK) {
                    if (param.intent){
						var imagedata=param.intent.getBlobExtra("data");
						viewImg.image=imagedata;
						image = event.media;
						viewImg.width='78%',
						viewImg.height='78%',
						seleccionarImagen = true;
					}
				}
			});
				
		},
		
		cancel: function(){
				alert('No se accede a galeria');
		},
		
	});
};


//captura foto
function CapturaFoto(e) {
	if (!Ti.Media.hasCameraPermissions()) {
		Ti.Media.requestCameraPermissions(function (e) {
			if (e.success) {
				camaraFotos();
			} else {
				alert('No se puede tener permisos de la camara');
			}
		});
	} else {
		camaraFotos();
	};
};


function camaraFotos() {
	Ti.Media.showCamera({
		success: function (event) {
			var intent =Ti.Android.createIntent({
                action : "com.android.camera.action.CROP",
				data:event.media.nativePath,
				type:'image/*'
			});
			intent.putExtra("outputX", 300);
            intent.putExtra("outputY", 300);
            intent.putExtra("aspectX", 0);
            intent.putExtra("aspectY", 0);
            intent.putExtra("scale", true);
            intent.putExtra("return-data", true);
         
			var activity = $.index.getActivity();
			activity.startActivityForResult(intent, function(param){
				if (param.resultCode == Ti.Android.RESULT_OK) {
                    if (param.intent){
						var imagedata=param.intent.getBlobExtra("data");
						viewImg.image=imagedata;
						image = event.media;
						viewImg.width='78%',
						viewImg.height='78%',
						seleccionarImagen = true;
					}
				}
			});
		 },
	});
};



$.btnEnviar.addEventListener('click', function (e) {

	if (seleccionarImagen == false) {
		viewImg.setBorderColor("red");
		viewImg.setBackgroundImage(backgroundImage = '/images/descarga.png', height="10%", width="20%"),
		//viewImg.setHeight(height = "10%"),
		//viewImg.setWidth(width = "10%"),
		alert('No hay imagen para enviar');
	} else {
		
		var xhr = Ti.Network.createHTTPClient({
			onload: function (e) {
				var result = JSON.parse(this.responseText);
				console.log('Resultado_________ ', result);
                        //contador
				$.labelcontadorExitoso.setText(text='Exitosos:\n'+contadorE++);
				var DatosObjeto = {
					response: JSON.parse(this.responseText)
				};
				//Mandar a pantalla de datos
				Alloy.createController('datos', DatosObjeto).getView().open();

			},
			onsendstream: function (e) {
				Ti.API.info('Envio informaciòn____:  ' + e.progress);

			},
			onerror: function (e) {
				alert("Volver a intentar");
				console.log('Error-------- '+e.error);
				//contador
				$.labelcontadorFallados.setText(text='Fallados:\n'+ contadorF++);
			},
			timeout:20000
		});

		var imagenComprimida = ImageFactory.compress(image, 0.25);
		var img = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'imagen.png');
		img.write(imagenComprimida);

		var imag2 = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'imagen.png');
		imag2.read();

		var base64 = Ti.Utils.base64encode(imag2).toString();

		//convertir base64 a json
		var json64 = {
			"source": base64
		};

		xhr.open('POST', 'https://7chgh1ve59.execute-api.us-east-2.amazonaws.com/sda-test');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(JSON.stringify(json64));
	}
});



//rotar imagen +clik en la vista+
viewImg.addEventListener('click', function(){
	movimiento =Number(movimiento)+90;
	var movimientoImagen=ImageFactory.imageWithRotation(image,{
		degrees:-90,
	});
	image=movimientoImagen;
	viewImg.setImage(image);
	//viewImg.setTop(top="35%");
});

$.index.open();

