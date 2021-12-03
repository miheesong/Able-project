function changeCountry(e){

    document.getElementById("country").disabled = false;
    var sido = document.getElementById("province").value;
    var sigungu = document.getElementById("country");
    //console.log(sigungu.length);
    //console.log(sido);

    sigungu.options[0].selected = true;

    for(var i=1; i<sigungu.length; i++){
     sigungu.options[i].style.display = 'none';
    //console.log(sigungu.options[i].style.display);
    }

    for(var i=0; i<sigungu.length; i++){
        var sigunguSelect = sigungu.options[i].value;
        //console.log(sigunguSelect);
        //console.log(sigungu.options[i].text);
        //console.log("-------------")
        if(sido==sigunguSelect){
           sigungu.options[i].style.display = 'block';
           //console.log(document.getElementsByTagName("option")[i].style.display )
        }
    }
}
    $("#buttonFacility").click(function(){
        var sido = document.getElementById("province").value;
        var sigungu = document.getElementById("country");
        sigungu = sigungu.options[sigungu.selectedIndex].text;
        console.log(sido)
        console.log(sigungu)

        $.ajax({
                 url:"/facility",
                 type:"POST",
                 data:JSON.stringify({"sido": sido,"sigungu": sigungu}),
                 contentType: "application/json",
                 dataType :"json",
                 success: function(result) {
                 if (result) {
                 alert("잘갔따 잏이히힝힝")

                 } else {
                 alert("불러오기 실패");
                 }
               }
              });




    })
