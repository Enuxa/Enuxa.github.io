var openStudyDatas = function (source) {    
    studyDatas = new StudyDatas();
    
    console.log("Creation d'un planning à partir de " + source);
    
    studyDatas.limit = parseInt(source.limit);
    
    console.log("Limite :" + studyDatas.limit);
    
    for(var subjectName in source.subjects) {
        var subjectSource = source.subjects[subjectName];
        var subjectDate = new Date(subjectSource.exam);
        var subject = new Subject(subjectName, subjectDate);

        console.log("Chargement de " + subjectName)
     
        for(var chapterName in subjectSource.chapters) {
            var chapterSource = subjectSource.chapters[chapterName];
            var chapterExoCount = chapterSource.exoCount;
            var chapter = new Chapter(chapterName, chapterExoCount, false);

            console.log("\tChargement de " + chapterName);
            
            for(var i in chapterSource.sessions) {
                var sessionSource = chapterSource.sessions[i];
                var sessionExoCount = sessionSource.exoCount;
                var sessionChecked = sessionSource.checked;
                
                console.log("\t\tSession " + chapter.sessions.length);
                
                chapter.sessions.push(new Session(sessionExoCount, sessionChecked));
            }
            
            subject.chapters[chapter.name] = chapter;
        }
        
        studyDatas.subjects[subject.name] = subject;
    }
}