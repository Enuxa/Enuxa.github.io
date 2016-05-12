var studyDatas = null;
var studyProgress = 0;

try {
    if (document.cookie != "") {
        var sourceStr = document.cookie.replace("value=", "");
        console.log(sourceStr);
        var source = JSON.parse(sourceStr);
        openStudyDatas(source);
    }
} catch (error) {
    console.log("Impossible de charger les plannings de travail");
    console.log(error);
}

if(studyDatas == null) {
    studyDatas = new StudyDatas();
}

makePage();