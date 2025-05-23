var dt_defaultt;

function cargar_mis_observaciones(id_tramite)
 {    
    let url = project_name + "/mis-observaciones/expediente/" + id_tramite;
    $("#mis-observaciones tbody").empty();
    $.get(url, function(data, textStatus) {
        let body = "";
        let j = 1;
        if ( id_tramite != 0 ) {
            $.each(data, function(i, valor) {
                let url_ir_a_observacion = project_name + "/detalle/tramite/observacion/" + valor.id;
                let url_volver_solventar = project_name + "/cambiar/observacion/tramite/" + valor.id;
                
                let vdocumentoPadreHijo = '';
                if (valor.padre == null || valor.padre == '') {
                    vdocumentoPadreHijo = valor.documento;
                } 
                else {
                    vdocumentoPadreHijo = '<strong>' + valor.padre + '</strong> - ' + valor.documento;
                }

                let solventado='<i class="far fa-times-circle text-danger fa-2x"></i>';
                if ( valor.solventado == 1 ) solventado='<i class="far fa-check-circle text-success fa-2x"></i>';
                
                body += '   <tr>';
                // body += '       <td>' + j + '</td>';
                body += '       <td>'+ solventado +'</td>';
                body += '       <td>';
                body += '           <b>' + valor.folio + '</b>';
                body += '       </td>';
                body += '       <td>' + vdocumentoPadreHijo + '</td>';
                body += '       <td>' + valor.observacion + '</td>';
                body += '       <td class="text-center">' + valor.area + '</td>';
                body += '       <td class="text-center">';
                body += '           <span class="label label-light-' + valor.color_status + ' label-inline mr-2">';
                body += '               <span class="label label-' + valor.color_status + ' label-dot mr-2"></span>';
                body += '               <b>' + valor.status + '</b>';
                body += '           </span>';
                body += '       </td>';
                body += '       <td class="text-center">';
                //body += '           <div class"btn-icon-list">';
                if ( valor.id_status_tramite >= 5 || valor.id_status_tramite == 3 ) {
                    body += '           <a href="' + url_ir_a_observacion + '" class="btn btn-icon btn-outline-default btn-icon btn-circle">';
                    body += '               <i class="fa fa-search"></i>';
                    body += '           </a>';
                }
                else if ( valor.id_status_tramite == 4 ) {
                    if (valor.solventado == 0) {
                        body += '       <a class="btn btn-icon btn-sm btn-outline-primary btn-circle" href="' + url_ir_a_observacion + '" title="Agregar documentos a la observación">';
                        body += '           <i class="fa fa-plus"></i>';
                        body += '       </a>';
                        // body += '       <button class="btn btn-icon btn-sm btn-outline-success btn-circle" onclick="solventarObservacion(' + valor.id + ')" title="Solventar esta observación">';
                        // body += '           <i class="fas fa-save"></i>';
                        // body += '       </button>';
                    } 
                    else {
                        body += '       <button class="btn btn-icon btn-sm btn-outline-danger btn-circle" onclick="reloadObservation(' + valor.id + ', ' + id_tramite + ')" title="Desbloquear y volver a cargar solventación">';
                        body += '           <i class="fa fa-unlock"></i>';
                        body += '       </button>';
                    }
                }
                //body += '           </div>';
                body += '       </td>';
                body += '   </tr>';
                j++;
            });
        }
        $("#mis-observaciones tbody").append(body);
        
        // var myTable=$('#mis-observaciones').DataTable({
        //     language: {
        //         searchPlaceholder: 'Buscar...',
        //         sSearch: '',
        //         lengthMenu: '_MENU_ Registros/pagina',
        //     },            
        //     lengthChange: false
        // });

        // //assign a new searchbox for our table
        // $('#searchBox').on('keyup', 
        //     function() {
        //         myTable.search(this.value).draw();
        //     }
        // );
        
    }, "json");
    
 }

function solventarObservacion(idTramiteObservacion)
 {
    $.confirm({
        title: '¡ Advertencia !',
        content: '¿ Realmente desea  solventar la solventacion ?',
        type: 'orange', // Equivalente a "warning" en SweetAlert2
        buttons: {
            cancelar: {
                text: 'Cancelar',
                btnClass: 'btn btn-default',
                action: function() {
                    clicando = false;
                }
            },
            confirmar: {
                text: 'Confirmar',
                btnClass: 'btn btn-primary',
                action: function() {
                    solventar(idTramiteObservacion);
                }
            }
        }
    });                 
 }


function solventar(idTramiteObservacion)
{
    $.ajax({
        type: "POST",
        url: project_name + "/tramites/solventaciones/terminar-documento-observacion",
        data: {
            _token: $('input[name="_token"]').val(),
            id_observacion: idTramiteObservacion
        },             
        success: function(vjsonRespuesta) {
            $.confirm({   
                icon: 'fa fa-info-circle',
                title: 'Notificacion !',
                content: vjsonRespuesta.msg,
                type: 'green',       
                typeAnimated: true,
                animation: 'zoom',
                closeAnimation: 'scale',
                autoClose: 'confirmar|1000',
                buttons: {
                    confirmar: {
                        isHidden: true,                
                        action: function () {
                            if( vjsonRespuesta.rutaRedireccion != "" )
                                window.location=vjsonRespuesta.rutaRedireccion;
                        }
                    },
                    cancelar: { 
                        isHidden: true,                
                        action: function () {}
                    },
                }
            });                        
        },
        error: function(json) {

        }
    }); 
}

function reloadObservation(idTramiteObservacion, idTramite)
 {
    $.confirm({
        title: '¡ Advertencia !',
        content: '¿Realmente desea poner en OBSERVADO y volver a cargar archivos a la observacion.?',
        type: 'orange',
        theme: 'material',
        buttons: {
            Aceptar: function() {
                $.ajax({
                    type: "GET",
                    url: project_name + "/cambiar/observacion/" + idTramiteObservacion + "/tramite",
                    success: function(vrespuesta) {

                        $.alert({
                            title: 'Mensaje!',
                            content: '¡El usuario ha cancelado la acción!',
                            type: 'green'
                        });

                        cargar_mis_observaciones(idTramite);

                        // swal({
                        //     type: 'success',
                        //     title: 'Confirmación',
                        //     content: {
                        //         element: 'p',
                        //         attributes: {
                        //             innerHTML: vrespuesta.message,
                        //         },
                        //     },
                        //     showConfirmButton: false,
                        //     timer: 1500
                        // }).then(function() {
                        //     cargar_mis_observaciones(idTramite);
                        // });
                    },
                    error: function(json) {}
                });
            },
            Cancelar: function() {
                $.alert({
                    title: 'Mensaje!',
                    content: '¡El usuario ha cancelado la acción!',
                });
            }
        }
    });

    // swal({
    //     title: "¡ Advertencia !",
    //     text: "¿Realmente desea poner en OBSERVADO y volver a cargar archivos a la observacion.?",
    //     icon: "warning",
    //     buttons: {
    //         cancel: {
    //             text: 'Cancelar',
    //             value: false,
    //             visible: true,
    //             className: 'btn btn-default',
    //             closeModal: true,
    //         },
    //         confirm: {
    //             text: 'Confirmar',
    //             value: true,
    //             visible: true,
    //             className: 'btn btn-primary',
    //             closeModal: true
    //         }
    //     }
    // }).then((result) => {
    //     if (result) {
           
    //     }
    // });
 }

function enviar_solventacion(id_tramite)
 {
    let url = project_name + "/tramites/" + id_tramite + "/enviar-solventacion-observacion";
    $.ajax({
        type: "GET",
        url: url,
        success: function(json) {
            window.location.reload();
        },
        error: function(json) {}
    });
 }