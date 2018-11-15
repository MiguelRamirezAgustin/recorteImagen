// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


var DatosObjeto = args.response;
var formatoObjeto = DatosObjeto;

//mostrar notificaciones al abrir pantalla
function notificacion(){
var toast=Ti.UI.createNotification({
     message:"El servicio a regresado la infromacion",
     duration: Ti.UI.NOTIFICATION_DURATION_LONG,
     backgroundColor:"white",
     gravity:Titanium.UI.Android.GRAVITY_CLIP_VERTICAL,

});
 toast.show();
};
notificacion();



console.log('Informacion.... '+DatosObjeto);

var labeltitulo = Ti.UI.createLabel({
      color: "white",
      top: "3%",
      textAling: Titanium.UI.TEXT_ALIGNMENT_CENTER,
      text: "INFORMACIÒN",
      font: {
            fontSize: 18
      }
});
$.scrollview.add(labeltitulo);
  // siclo for que recorre al json para mostar la informacion
for (var i = 0; i < formatoObjeto.data.length; i++) {
      var labelNombre = Ti.UI.createLabel({
            color: "white",
            top: "5%",
            left: "5%",
            text: formatoObjeto.data[i].label,
            height: Ti.UI.SIZE,
      });
      var labelDomicilio = Ti.UI.createLabel({
            color: "white",
            top: "5",
            left: "5%",
            text: formatoObjeto.data[i].value,
      });
      $.scrollview.add(labelNombre);
      $.scrollview.add(labelDomicilio);
}

