/**
 * Ajoute une session à la page
 * session      La session à ajouter
 * component    Le composant auquel ajouter la session
 */
var addSessionSection = function (session, subjectName, chapterName, sessionIndex, component) {
    var element = document.createElement("li");
    element.className = "session";

    var lblName = document.createElement("label");
    lblName.innerHTML = session.exoCount + " exercices";
    
    var chckBox = document.createElement("input");
    chckBox.id = strToArg(subjectName) + "." + strToArg(chapterName) + "." + sessionIndex;
    chckBox.setAttribute("type", "checkbox");
    if(session.checked) {
        chckBox.setAttribute("checked", "");
    }
    chckBox.setAttribute("onchange", "checkedSession(\'" + strToArg(subjectName) + "\', \'" + strToArg(chapterName) + "\', \'" + sessionIndex + "\', this.checked);");

    lblName.setAttribute("for", chckBox.id);
    
    element.appendChild(lblName);
    element.appendChild(chckBox);
    
    component.appendChild(element);
}

/**
 * Ajoute un chapitre à la page
 * chapter      Le chapitre à ajouter
 * component    Le composant auquel ajouter la session
 */
var addChapterSection = function (chapter, subjectName, component) {
    var element = document.createElement("li");
    element.className = "chapter";
    element.id = subjectName + "." + chapter.name;
    
    var h = document.createElement("h3");
    h.innerHTML = chapter.name;
    h.title = "Supprimer " + chapter.name;
    h.setAttribute("onclick", "removeChapter('" + strToArg(subjectName) + "', '" + strToArg(chapter.name) + "');")
    
    var list = document.createElement("ul");
    list.className = "sessionslist";
    for(var i in chapter.sessions) {
        addSessionSection(chapter.sessions[i], subjectName, chapter.name, i, list);
    }
    
    element.appendChild(h);
    element.appendChild(list);
    
    component.appendChild(element);
}

/**
 * Ajoute une matière à la page
 * subject      La matière à ajouter
 * component    Le composant auquel ajouter la session
 */
var addSubjectSection = function(subject, component) {
    var element = document.createElement("li");
    element.className = "subject";
    element.id = subject.name;
    
    var h = document.createElement("h2");
    h.setAttribute("onclick", "removeSubject('" + strToArg(subject.name) + "');")
    h.title = "Supprimer " + subject.name;
    var remainingDays = subject.exam.getDate() -  (new Date).getDate();
    var margin = remainingDays - subject.sessionsCount() + subject.checkedCount();
    var marginText = "<span class='" + (margin > 0 ? "margin" : "nomargin") + "'>" +
                    (margin > 0 ? margin + " jour(s) de marge" : 
                    (margin == 0 ? "aucun jour de marge !" : -margin + " jours de retard !")
                    ) + "</span>";
    h.innerHTML = subject.name + 
                    " - " + 
                    subject.exam.toLocaleDateString() + 
                    " (" + 
                    remainingDays + 
                    " jour(s) restant, " + 
                    marginText +
                    ")";
    
    var list = document.createElement("ul");
    list.className = "chapterslist";
    list.id = subject.name + ".chapterslist";
    for(var chapter in subject.chapters) {
        addChapterSection(subject.chapters[chapter], subject.name, list);
    }
    
    var chapterCreation = document.createElement("div");
    chapterCreation.className = "chaptercreation";
    var chapterNameLbl = document.createElement("label");
    chapterNameLbl.innerHTML = "Intitulé du chapitre";
    chapterNameLbl.setAttribute("for", subject.name + "." + "chaptername");

    var chapterName = document.createElement("input");
    chapterName.placeholder = "Intégrales de Riemann";
    chapterName.type = "text";
    chapterName.id = subject.name + "." + "chaptername"
    var chapterExoCountLbl = document.createElement("label");
    chapterExoCountLbl.innerHTML = "Nombre d'exercices";
    chapterExoCountLbl.setAttribute("for", subject.name + "." + "chapterexoCount");
    var chapterExoCount = document.createElement("input");
    chapterExoCount.min = "1";
    chapterExoCount.placeholder = "25";
    chapterExoCount.type = "number";
    chapterExoCount.id = subject.name + "." + "chapterexoCount";
    var button = document.createElement("button");
    button.innerHTML = "Nouveau chapitre";
    button.setAttribute("onclick", "newChapter('" + strToArg(subject.name) + "');");

    chapterCreation.appendChild(chapterNameLbl);
    chapterCreation.appendChild(chapterName);
    chapterCreation.appendChild(chapterExoCountLbl);
    chapterCreation.appendChild(chapterExoCount);
    chapterCreation.appendChild(button);
    
    element.appendChild(h);
    element.appendChild(list);
    element.appendChild(chapterCreation);
    
    component.appendChild(element);
}

/**
 * Crée une matière et l'ajoute à la page
 */
var newSubject = function() {
    var name = document.getElementById("subjectname").value;
    var date = new Date(document.getElementById("subjectdate").value);
    var subject = new Subject(name, date);
    
    studyDatas.subjects[subject.name] = subject;
    
    var list = document.getElementById("subjectslist");
    
    studyDatas.save();
    
    makePage();
}

/**
 * Ajoute un nouveau chapitre à une matière
 * subjectName  Le nom de la matière.
 */
var newChapter = function(subjectName) {
    var name = document.getElementById(subjectName + ".chaptername").value;
    var exoCount = parseInt(document.getElementById(subjectName + ".chapterexoCount").value);
    var chapter = new Chapter(name, exoCount, true);
    
    studyDatas.subjects[subjectName].chapters[name] = chapter;
    
    var list = document.getElementById(subjectName + ".chapterslist");
    
    studyDatas.save();
    
    makePage();
}

/**
 * Place un backslash avant les apostrophes et guillemets 
 */
var strToArg = function(str) {
    return str.replace("'", "\\'").replace("\"", "\\\"");
}

/**
 * (Re)construis la page
 */
var makePage = function() {
    var list = document.getElementById("subjectslist");
    list.innerHTML = "<div id='progressbar'>\
                        <div id='progressdone' style='width: " + studyProgress + "%'></div>\
                        <div id='progressleft' style='width: " + (99 - studyProgress) + "%'></div>\
                     </div>";

    startProgressAnimation(studyProgress,
                            Math.floor(studyDatas.getProgress() * 100),
                            500);
    
    document.getElementById("limit").value = studyDatas.limit;
    
    for(var subject in studyDatas.subjects) {
        addSubjectSection(studyDatas.subjects[subject], list);
    }
}

/**
 * Lance l'animation pour l'actualisation de la barre de progression
 * p0       Le pourcentage de progression de départ
 * p1       Le pourcentage de progression final
 * duration Le temps de l'animation en millisecondes
 */
var startProgressAnimation = function(p0, p1, duration) {
    var frameRate = 1 / 60;
    
    var stepCursor = 1000 * frameRate / duration;

    var cursor = 0;
    var interval = setInterval(function() {
        cursor += stepCursor;
        studyProgress = p0 + Math.sin(cursor * Math.PI / 2) * (p1 - p0);
        if(cursor < 0 || cursor > 1) {
            clearInterval(interval);
        } else {
            document.getElementById("progressdone").style = "width:" + studyProgress + "%" ;
            document.getElementById("progressleft").style = "width:" + (99 - studyProgress) + "%" ;
        }
    },
    1000 * frameRate);
}

/**
 * Fonction à appeler lorsqu'un chapitre  a été supprimé
 */
var removeChapter = function(subjectName, chapterName) {
    if(confirm("Êtes vous sûr de vouloir supprimer " + chapterName + " ?")) {
        delete studyDatas.subjects[subjectName].chapters[chapterName];
        
        studyDatas.save();
        
        makePage();
    }
}

/**
 * Fonction à appeler lorsqu'une matière a été supprimée
 */
var removeSubject = function(subjectName) {
    if (confirm("Êtes vous sûr de vouloir supprimer " + subjectName + " ?")) {
        delete studyDatas.subjects[subjectName];
        
        studyDatas.save();
        
        makePage();
    }
}

/**
 * Fonction à appeler lorsque la limite a été modifiée
 */
var limitChanged = function() {
    studyDatas.limit = parseInt(document.getElementById("limit").value);
    
    studyDatas.save();
}

/**
 * Fonction à appeler lorsqu'une session a été cochée
 */
var checkedSession = function(subjectName, chapterName, sessionIndex, checked) {
    var session = studyDatas.subjects[subjectName].chapters[chapterName].sessions[sessionIndex];
    
    session.checked = checked;
    
    studyDatas.save();
    
    makePage();
}