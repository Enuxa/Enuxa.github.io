/**
 * Interpolation cosinusoïdale de a et b selon un paramètre t
 */
function cerp(a, b, t) {
    return (b - a) * (1 - Math.cos(t * Math.PI)) / 2 + a;
}

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
    setChapterHeaderContent(h, chapter);
    h.id = subjectName + "." + chapter.name + ".header";
    h.setAttribute("onclick", "removeChapter('" + strToArg(subjectName) + "', '" + strToArg(chapter.name) + "');")
    setChapterHeaderContent(h, chapter);

    var div = document.createElement("div");
    div.className = "chaptercollapse";
    div.setAttribute("onclick", "collapseToggle(\'" + subjectName + "\', \'" + chapter.name + "\');");
    
    var list = document.createElement("ul");
    list.className = "sessionslist";
    for(var i in chapter.sessions) {
        addSessionSection(chapter.sessions[i], subjectName, chapter.name, i, list);
    }
    
    if(chapter.isChecked()) {
        list.setAttribute("hidden", "");
    }
    
    element.appendChild(h);
    element.appendChild(div);
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
    h.id = subject.name + ".header";
    h.setAttribute("onclick", "removeSubject('" + strToArg(subject.name) + "');")
    h.title = "Supprimer " + subject.name;

    setSubjectHeaderContent(h, subject);
    
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
    
    addSubjectSection(subject, list);
    
    makeBar();
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
    
    addChapterSection(chapter, subjectName, list);
    
    makeBar();
    setSubjectHeaderContent(document.getElementById(subjectName + ".header") , studyDatas.subjects[subjectName])
}

/**
 * Place un backslash avant les apostrophes et guillemets 
 */
var strToArg = function(str) {
    return str.replace("'", "\\'").replace("\"", "\\\"");
}

/**
 * Construis la page
 */
var makePage = function() {
    makeBar();
    
    var list = document.getElementById("subjectslist");
    document.getElementById("limit").value = studyDatas.limit;
    
    var sorted = studyDatas.getSortedByTardiness();
    for(var i in sorted) {
        addSubjectSection(sorted[i], list);
    }
}

function setChapterHeaderContent(h, chapter) {
    h.innerHTML = chapter.name + (chapter.isChecked() ? " &#10003;" : "");
}

function setSubjectHeaderContent(h, subject) {
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
}

/**
 * Acualise l'affichage de la barre de progrès.
 */
var makeBar = function () {
    var body = document.body;
    var html = "<div id='progressbar'>\
                    <div id='progressdone' style='width: " + studyProgress + "%'><p>" + studyDatas.checkedCount() + " sessions faites</p></div>\
                    <div id='progressleft' style='width: " + (99 - studyProgress) + "%'>" + studyDatas.uncheckedCount() + " sessions restantes</div>\
                    </div>";
    if(document.getElementById("progressbar") == null) {
        body.innerHTML = html + body.innerHTML;
    } else {
        document.getElementById("progressbar").innerHTML = html;
    }
    
    startProgressAnimation(studyProgress, studyDatas.getProgress() * 100);
}

/**
 * Lance l'animation pour l'actualisation de la barre de progression
 * p0       Le pourcentage de progression de départ
 * p1       Le pourcentage de progression final
 * duration Le temps de l'animation en millisecondes
 */
var startProgressAnimation = function(p0, p1) {
    var frameRate = 1 / 60;
    var duration = 1500;
    
    var stepCursor = 1000 * frameRate / duration;

    var cursor = 0;
    var interval = setInterval(function() {
        studyProgress = cerp(p0, p1, cursor);
        if(cursor < 0 || cursor > 1) {
            clearInterval(interval);
        } else {
            document.getElementById("progressdone").style = "width:" + studyProgress + "%" ;
            document.getElementById("progressleft").style = "width:" + (99 - studyProgress) + "%" ;
        }
        cursor += stepCursor;
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
        
        var chapter = document.getElementById(subjectName + "." + chapterName);
        chapter.remove();
        
        makeBar();
        setSubjectHeaderContent(document.getElementById(subjectName + ".header"), studyDatas.subjects[subjectName]);
    }
}

/**
 * Fonction à appeler lorsqu'une matière a été supprimée
 */
var removeSubject = function(subjectName) {
    if (confirm("Êtes vous sûr de vouloir supprimer " + subjectName + " ?")) {
        delete studyDatas.subjects[subjectName];
        
        studyDatas.save();
        
        var subject = document.getElementById(subjectName);
        subject.remove();
        
        makeBar();
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
    var chapter = studyDatas.subjects[subjectName].chapters[chapterName];
    var session = chapter.sessions[sessionIndex];
    
    var beforeChecked = chapter.isChecked();
    
    session.checked = checked;
    
    studyDatas.save();
    
    makeBar();
    
    if(chapter.isChecked() && !beforeChecked) {
        collapseToggle(subjectName, chapterName);
    }
    
    setChapterHeaderContent(document.getElementById(subjectName + "." + chapterName + ".header"), chapter);
    
    setSubjectHeaderContent(document.getElementById(subjectName + ".header"), studyDatas.subjects[subjectName]);
}

var collapseToggle = function (subjectName, chapterName) {
    var chapter = document.getElementById(subjectName + "." + chapterName);
    var list = chapter.getElementsByClassName("sessionslist").item(0);
    var frameRate = 1 / 60;
    var duration = 300;

    if(list.hasAttribute("hidden")) {
        list.removeAttribute("hidden");
        var height1 = list.clientHeight;
        var margin1 = parseFloat(window.getComputedStyle(list).marginTop.replace("px", ""));
        list.setAttribute("style", "height: 0px; margin-top: 0px;");
        var height0 = 0;
        var margin0 = 0;
    } else {
        var height0 = list.clientHeight;
        var height1 = 0;        
        var margin0 = parseFloat(window.getComputedStyle(list).marginTop.replace("px", ""));
        var margin1 = 0;
    }
    
    var cursor = 0;
    
    var interval = setInterval(function () {
        list.setAttribute("style",  "height:" + cerp(height0, height1, cursor) + "px;" +
                                     "margin-top:" + cerp(margin0, margin1, cursor) + "px;");
        
        if (cursor >= 1) {
            clearInterval(interval);
            if(height1 == 0) {
                list.setAttribute("hidden", "");
            }
            list.removeAttribute("style");
            return;
        }

        
        cursor += 1000 * frameRate / duration;
        cursor = Math.min(cursor, 1);
    }, 1000 * frameRate);
}