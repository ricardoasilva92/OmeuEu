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

$(document).ready(function(){
    $('.delete-pub2').on('click',function(e){ //e -> evento
        $target = $(e.target)               //variavel para obter o o atibuto data-id
        //console.log($target.attr('data-id'))
        const user = $target.attr('data-id')
        $.ajax({
            type:'DELETE',
            url:'/pub/delete/' + user,
            success: function(response){
                alert('Eliminando Publicações do user')
                window.location.href='/'
            },
            error:function(err){
                console.log(err)
            }
        })
    })
})