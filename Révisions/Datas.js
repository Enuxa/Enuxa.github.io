/**
 * Crée une nouvelle session de révisions
 * exoCount Nombre d'exercices
 * checked  Si cette session a été faite
 */
var Session = function (exoCount, checked) {
    return {
            exoCount : exoCount,
            checked : checked,
            toggle : function () {
                this.checked = !this.checked;
            }
        };
}

/**
 * Crée un nouveau chapitre à réviser
 * name     Nom du chaptitres
 * exoCount Nombre d'exercices à faire
 */
var Chapter = function (name, exoCount, makeSessions) {
    this.name = name;
    this.exoCount = exoCount;
    this.sessions = new Array();
    
    var remainingPages = exoCount;
    
    var sessionNbExxpectation = Math.round(exoCount / studyDatas.limit);
    var step = Math.ceil (exoCount / sessionNbExxpectation);
    
    while(makeSessions && remainingPages > 0) {
        var sessionExoCount = Math.min(step, remainingPages);
        this.sessions.push(new Session(sessionExoCount, false));
        remainingPages -= sessionExoCount;
    }
    
    this.isChecked = function() {
        for(var session in this.sessions) {
            if(!this.sessions[session].checked) {
                return false;
            }
        }
        
        return true;
    }
    
    this.toString = function() {
        var str = name;
        str += " ("
        for(var i in this.sessions) {
            str += this.sessions[i].exoCount + " [" + this.sessions[i].checked ? "x" : " " + "]+\n";
        }
        str += ")";
        return str;
    }
}

/**
 * Crée une nouvelle matière à réviser
 * chapterList  Tableau des chaptitres à réviser
 * date         Date de l'examen
 */
var Subject = function (name, date) {
    this.name = name;
    this.chapters = {};
    this.exam = date;

    this.toString = function () {
        var str = name + " (" + date.toString() + ")";
        for(var i in this.chapters) {
            if(i == 0) {
                str += "Chapitres :\n";
            }
            str += this.chapters[i] + "\n";
        }
        return str;
    }
    
    this.sessionsCount = function () {
        var n = 0;
        for(var chapterName in this.chapters) {
            n += this.chapters[chapterName].sessions.length;
        }
        
        return n;
    }
    
    this.checkedCount = function () {
        var n = 0;
        for(var chapterName in this.chapters) {
            var chapter = this.chapters[chapterName];
            for(var sessionIndex in chapter.sessions) {
                n += chapter.sessions[sessionIndex].checked ? 1 : 0;
            }
        }
        
        return n;
    }
    
    this.uncheckedCount = function() {
        return this.sessionsCount() - this.checkedCount();
    }
}

/**
 * Crée un nouveau planning de révisions
 */
var StudyDatas = function () {
    return {
        subjects : {},
        limit : 10,
        sessionsCount : function () {
            var n = 0;
            for(var subjectName in this.subjects) {
                n += this.subjects[subjectName].sessionsCount();
            }
            return n;
        },
        checkedCount : function () {
            var n = 0;
            for(var subjectName in this.subjects) {
                n += this.subjects[subjectName].checkedCount();
            }
            return n;
        },        
        uncheckedCount : function () {
            var n = 0;
            for(var subjectName in this.subjects) {
                n += this.subjects[subjectName].uncheckedCount();
            }
            return n;
        },
        getProgress : function() {
            if(this.sessionsCount() == 0) {
                return 1;
            } else {
                return this.checkedCount() / this.sessionsCount();
            }
        },
        save : function () {
            var expiration = new Date(this.getLastExamDate().toJSON());
            expiration.setDate(expiration.getDate() + 1);
            document.cookie = "value=" + JSON.stringify(this) + "; expires=" + expiration.toUTCString() + ";";
        },
        getFirstExamDate : function () {
            var min = null;
            for(var name in this.subjects) {
                var current = this.subjects[name].exam;
                if(min == null) {
                    min = current;
                } else {
                    min = current < min ? current : min;
                }
            }
            
            return min;
        },
        getLastExamDate : function () {
            var max = null;
            for(var name in this.subjects) {
                var current = this.subjects[name].exam;
                if(max == null) {
                    max = current;
                } else {
                    max = current > max ? current : max;
                }
            }
            
            return max;
        },
        getSortedByTardiness : function() {
            var sorted = new Array();

            for(var subjectName in this.subjects) {
                sorted.push(this.subjects[subjectName]);
            }

            sorted.sort(function(a, b) {
                return b.uncheckedCount() - a.uncheckedCount();
            });

            return sorted;
        },
        toString : function () {
            return this.subjects.toString();
        }
    };
}