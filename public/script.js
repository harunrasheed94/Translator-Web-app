// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("Entering js");
var ratingForTranslation = -1;
let sortOptions = function() {
  jQuery('[data-toggle="tooltip"]').tooltip();
  jQuery(".selectcls").each(function(){
    var options = jQuery(this).find("option");
    var arr = options.map(function(_, o) { return { t: jQuery(o).text(), v: o.value }; }).get();
    arr.sort(function(o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
    options.each(function(i, o) {
    o.value = arr[i].v;
    jQuery(o).text(arr[i].t);
});
  });
  
}

let bindFunction = function() {
    
  jQuery(".rate input[type='radio']").on("change",function(){
      let thisElem = jQuery(this);
      ratingForTranslation = thisElem.val();
    });
  
  jQuery("#surveylinkbtn").on("click",function(){
    if(ratingForTranslation == -1){
      alert("Please rate the translation before completing the survey");
    }
    else{
      SendData(ratingForTranslation,function(){
        window.location.replace('https://ufl.qualtrics.com/jfe/form/SV_0pRBJXRozfx6koC');
      });
      
    }
  });
  
    jQuery("#swapbtn").on("click",function(){
       let disabledUserId = jQuery(".textareacls:disabled").attr("id"); 
       let enabledUserId = jQuery(".textareacls:enabled").attr("id");
       let enabledUserName = enabledUserId == "user1text" ? "#user1namediv":"#user2namediv";
       let disabledUserName = disabledUserId == "user1text" ? "#user1namediv":"#user2namediv";
       jQuery("#"+disabledUserId).prop('disabled',false);
       jQuery("#"+enabledUserId).prop('disabled',true);
       jQuery(enabledUserName).removeClass('useractivecls').addClass('userinactivecls').tooltip('hide').attr('data-original-title', 'Inactive User');
       jQuery(disabledUserName).removeClass('userinactivecls').addClass('useractivecls').tooltip('hide').attr('data-original-title', 'Active User');
    });
  
    jQuery(".selectcls").on("change",function(){
      let thisElem = jQuery(this);
      thisElem.parent(".selectdivcls").next(".textareaparentdiv").find('textarea').val("")
    });
  
    jQuery("#translate").click(function(){
       
       let disabledUserId = jQuery(".textareacls:disabled").attr("id"); 

       //user1 enabled
       if (disabledUserId == "user2text"){
        let langfrom = jQuery("#language1").val();
        let contenttoTranslate = jQuery("#user1text").val().trim();
        let langto = jQuery("#language2").val();
        contenttoTranslate.length > 0?fetchTranslatedText(langfrom,langto,"#user1text","#user2text","#user1namediv","#user2namediv"):alert("Please enter valid text");    
       }//user2 enabled
       else {
        let langfrom = jQuery("#language2").val();
        let contenttoTranslate = jQuery("#user2text").val().trim();
        let langto = jQuery("#language1").val();
        contenttoTranslate.length > 0?fetchTranslatedText(langfrom,langto,"#user2text","#user1text","#user2namediv","#user1namediv"):alert("Please enter valid text");
       }
       
    });
}

let fetchTranslatedText = function(langFrom,langTo,enabledUser,disabledUser, enabledUserName, disabledUserName) {
    let contenttoTranslate = jQuery(enabledUser).val();
    fetch("/translate?user_in="+ contenttoTranslate +"&lang_from="+langFrom+"&lang_to="+langTo)
    .then(response=> {
         response.json().then(function(data) {
         console.log(data[0]['translations'][0].text);
         let translatedtext = data[0]['translations'][0].text
         jQuery(disabledUser).val(translatedtext).prop('disabled',false);
         jQuery(enabledUser).prop('disabled',true);
           
         jQuery(enabledUserName).removeClass('useractivecls').addClass('userinactivecls').tooltip('hide').attr('data-original-title', 'Inactive User');
         jQuery(disabledUserName).removeClass('userinactivecls').addClass('useractivecls').tooltip('hide').attr('data-original-title', 'Active User');
         let text = enabledUser == "#user1text" ? contenttoTranslate : translatedtext;
         let user = enabledUser == "#user1text" ? "user1" : "user2" ;
         appendToConversationHistory(text,user);
         });
     });
}

let appendToConversationHistory = function(text,user) {
    let divElem = jQuery('<div/>');
    if(user == "user1"){
        divElem.addClass('user1convhistdivcls colorblack convtextdiv');
    }
    else{
        divElem.addClass('user2convhistdivcls colorblack convtextdiv');
    }
    divElem.text(text);
    let noOfConvDiv = jQuery(".convtextdiv").length;
    jQuery("#convhistdispdiv").append(divElem);
      
}

var firebaseConfig = {
      apiKey: "AIzaSyBggaBfODIAvXhy_nx_jwUlluTvxR_AKPw",
      authDomain: "hciproj1.firebaseapp.com",
      databaseURL: "https://hciproj1-default-rtdb.firebaseio.com",
      projectId: "hciproj1",
      storageBucket: "hciproj1.appspot.com",
      messagingSenderId: "477277040169",
      appId: "1:477277040169:web:83d73db10e5ed9f58d7638"
      };

 firebase.initializeApp(firebaseConfig);

 let SendData = function(state,callback) {
    var myDBConn = firebase.database().ref();
    var a1 = myDBConn.child("p1");
    var test = a1.push({ rating: state});
    console.log(test);
    setTimeout(function(){
      if(callback != undefined){
      callback();
     }
    },1000);
}

sortOptions();
bindFunction();