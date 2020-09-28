//Rename Artboards for Adobe Illustrator CC/2020
//$.writeln('--start--');
var docName; //try move under IF hood
var delimiter;

if (app.documents.length > 0)
{
    var versionNumber = 'Version 0.86';
    var doc = app.activeDocument;
    var allRange = doc.artboards.length;
    var rangeInputText = '1-'+allRange;

    var promptWindow = new Window('dialog', 'Rename Artboards Options:');
    //promptWindow.location = [250,250];
    //promptWindow.size = [1000,1200];
    //[startX, StartY, EndX, EndY]

    promptWindow.includeFileName = promptWindow.add('panel', undefined, 'Filename:');
    promptWindow.includeFileName.fileNameCheckbox = promptWindow.includeFileName.add('checkbox', [20,20,170,39], 'Include file name');
    promptWindow.includeFileName.fileNameCheckbox.helpTip = 'Include file name before.'; 
    promptWindow.includeFileName.fileNameCheckbox.value = true;
    promptWindow.includeFileName.orientation='column';

    promptWindow.renamingMethod = promptWindow.add('panel', undefined, 'Renaming Method:');
    promptWindow.renamingMethod.orientation='column';
    promptWindow.renamingMethod.renameSame = promptWindow.renamingMethod.add('radiobutton', [20,20,170,35], 'All the same');
    promptWindow.renamingMethod.renameSame.helpTip = 'Rename all artboards\nthe same as file name.';
    promptWindow.renamingMethod.renameNameNumber = promptWindow.renamingMethod.add('radiobutton', [20,20,170,35], 'Add number');
    promptWindow.renamingMethod.renameNameNumber.helpTip = 'Rename all artboards\nusing numeration.';
    promptWindow.renamingMethod.renameNameMms = promptWindow.renamingMethod.add('radiobutton', [20,20,170,35], 'Add size in millimeters');
    promptWindow.renamingMethod.renameNameMms.helpTip = 'Rename all artboards\nand add dimensions\n(in millimeters).';
    promptWindow.renamingMethod.renameNamePxs = promptWindow.renamingMethod.add('radiobutton', [20,20,170,35], 'Add size in pixels');
    promptWindow.renamingMethod.renameNamePxs.helpTip = 'Rename all artboards\nand add dimensions\n(in pixels).';
    promptWindow.renamingMethod.renameNameMms.value = true;

    //Applied Range
    promptWindow.range = promptWindow.add('panel', undefined, 'Range of artboards:');
    promptWindow.range.helpTip = 'Specify ranges by hyphen\nor separate artboards by commas.'; 
    promptWindow.range.orientation='row';
    promptWindow.range.selectAll = promptWindow.range.add('radiobutton', [15,15,65,35], 'All');
    promptWindow.range.selectAll.helpTip = 'Rename all artboards.';
    promptWindow.range.selectRange = promptWindow.range.add('radiobutton', [15,15,75,35], 'Range:');
    promptWindow.range.selectRange.helpTip = 'Rename chosen artboards.\nSpecify ranges by hyphen\nor separate artboards by commas.';
    promptWindow.range.rangeInput = promptWindow.range.add('edittext', [15,15,160,35], rangeInputText);
    promptWindow.range.helpTip = 'Specify ranges by hyphen\nor separate artboards by commas.';
    promptWindow.range.selectAll.value = true;
    promptWindow.range.rangeInput.onActivate = function() {
        promptWindow.range.selectRange.value = true;
    };

    promptWindow.version = promptWindow.add('statictext', undefined, versionNumber);
    promptWindow.version.helpTip = 'copyleft';

    promptWindow.confirmation = promptWindow.add('group', undefined, 'Rename confirmation');
    promptWindow.confirmation.orientation='row';
    promptWindow.confirmation.cancelButton = promptWindow.confirmation.add('button', undefined, 'Cancel', {name:'cancel'});
    promptWindow.confirmation.renameButton = promptWindow.confirmation.add('button', undefined, 'Rename', {name:'ok'});

    promptWindow.confirmation.cancelButton.onClick = doNothing;
    promptWindow.confirmation.renameButton.onClick = applyMethod;
    promptWindow.show();

    //$.writeln('---end---');

    

} else {
    alert('Open document first.');
}

function doNothing() {
    //$.writeln('Renaming is cancelled');
    promptWindow.hide();
};

function setDocName() {
    var prefixName;
    if (promptWindow.includeFileName.fileNameCheckbox.value) {
        prefixName = doc.name;
        prefixName = prefixName.replace(/\..+$/, '');
        delimiter = '--';
        return prefixName;
    } else if (!promptWindow.includeFileName.fileNameCheckbox.value && promptWindow.renamingMethod.renameSame.value) {
        prefixName = 'My name is Legion, for we are many >:)';
        delimiter = '--';
        return prefixName;
    } else {
        prefixName = '';
        delimiter = '';
        return prefixName;
    }
}

function applyMethod() {
    docName = setDocName();
    //$.writeln('File name: '+docName);
    commaArray = promptWindow.range.rangeInput.text.split(',');
    var unpackedRangeArray = [];

    if (promptWindow.range.selectRange.value) {
        for (var i = 0; i < commaArray.length; i++) {
            //$.writeln(commaArray[i]);
            if (commaArray[i].indexOf('-') > -1) {
                rangeMinMax = commaArray[i].split('-');
                //$.writeln('rangeMinMax: '+rangeMinMax);
                //for (var j = parseInt(rangeMinMax[0]); j <= parseInt(rangeMinMax[1]); j++) {
                for (var j = parseInt(rangeMinMax[0]); j <= parseInt(rangeMinMax[rangeMinMax.length-1]); j++) {
                    unpackedRangeArray.push(j-1);
                };
            } else {
                unpackedRangeArray.push(parseInt(commaArray[i])-1);
            };
        };
        //$.writeln('Range: unpackedRangeArray: '+unpackedRangeArray);
        for (var k in unpackedRangeArray) {
            //$.writeln('in unpackedRangeArray#'+k+'='+unpackedRangeArray[k]+typeof unpackedRangeArray[k]);
        };
    } else {
        for (var i = 0; i < doc.artboards.length; i++) {
            unpackedRangeArray.push(i);
        };
        //$.writeln('ALL: unpackedRangeArray: '+unpackedRangeArray);
    };
    
    if (promptWindow.renamingMethod.renameSame.value) {
        //$.writeln('Method: all the same');
        for (var r in unpackedRangeArray) {
            var index = unpackedRangeArray[r];
            doc.artboards[index].name = docName;
            };
        };
    if (promptWindow.renamingMethod.renameNameNumber.value) {
        //$.writeln('Method: name+number');
        for (var r in unpackedRangeArray) {
            var index = unpackedRangeArray[r];
            doc.artboards[index].name = docName+delimiter+(index+1);
            };
        };
    if (promptWindow.renamingMethod.renameNameMms.value) {
        //$.writeln('Method: name+mm');
        for (var r in unpackedRangeArray) {
            var index = unpackedRangeArray[r];
            var rectArray = doc.artboards[index].artboardRect;
            var widthPts = rectArray[2] - rectArray[0];
            var heightPts = (rectArray[3] - rectArray[1]) * -1;
            var widthMms = Math.round(new UnitValue(widthPts, 'pt').as('mm'));
            var heightMms = Math.round(new UnitValue(heightPts, 'pt').as('mm'));
            doc.artboards[index].name = docName+delimiter+widthMms+'x'+heightMms+'mm';
            };
        };
    if (promptWindow.renamingMethod.renameNamePxs.value) {
        //$.writeln('Method: name+px');
        //for (var i = 0; i < doc.artboards.length; i++) {
        for (var r in unpackedRangeArray) {
            var index = unpackedRangeArray[r];
            var rectArray = doc.artboards[index].artboardRect;
            var widthPts = rectArray[2] - rectArray[0];
            var heightPts = (rectArray[3] - rectArray[1]) * -1;
            var widthPxs = Math.round(new UnitValue(widthPts, 'pt').as('px'));
            var heightPxs = Math.round(new UnitValue(heightPts, 'pt').as('px'));
            doc.artboards[index].name = docName+delimiter+widthPxs+'x'+heightPxs+'px';
            };
        };
    promptWindow.hide();
};