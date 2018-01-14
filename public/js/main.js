$(document).ready(function(){
    $('.delete-pub').on('click',function(e){ //e -> evento
        $target = $(e.target)               //variavel para obter o o atibuto data-id
        //console.log($target.attr('data-id'))
        const id = $target.attr('data-id')
        $.ajax({
            type:'DELETE',
            url:'/pub/'+id,
            success: function(response){
                alert('Eliminando Publicação')
                window.location.href='/'
            },
            error:function(err){
                console.log(err)
            }
        })
    })
})