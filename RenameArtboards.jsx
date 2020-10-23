//Rename Artboards for Adobe Illustrator CC/2020

if (app.documents.length == 0) {
    alert('Open document first.');
} else {
    var versionNumber = 'Version 0.91';
    var doc = app.activeDocument;
    var docName;
    var delimiter;
    var allRange = doc.artboards.length;
    var rangeInputText = '1-' + allRange;
    var protectedLocale = '';
    var promptWindow = new Window('dialog', 'Rename Artboards Options:');
    //promptWindow.location = [250,250];
    //promptWindow.size = [1000,1200];
    //[startX, StartY, EndX, EndY]

    promptWindow.includeFileName = promptWindow.add('panel', undefined, 'Filename:');
    promptWindow.includeFileName.fileNameCheckbox = promptWindow.includeFileName.add('checkbox', [20,20,170,39], 'Include file name');
    promptWindow.includeFileName.fileNameCheckbox.helpTip = 'Include file name before.';
    promptWindow.includeFileName.fileNameCheckbox.value = true;
    promptWindow.includeFileName.orientation = 'column';

    promptWindow.protectLocales = promptWindow.add('panel', undefined, 'Protect language identificators:');
    promptWindow.protectLocales.uaCheckbox = promptWindow.protectLocales.add('checkbox', [20,0,170,15], 'ua and ukr');
    promptWindow.protectLocales.uaCheckbox.helpTip = 'Protecting ua, -ua, _ua, ukr, -ukr and _ukr strings.';
    promptWindow.protectLocales.uaCheckbox.value = true;
    promptWindow.protectLocales.ruCheckbox = promptWindow.protectLocales.add('checkbox', [20,0,170,15], 'ru and rus');
    promptWindow.protectLocales.ruCheckbox.helpTip = 'Protecting ru, -ru, _ru, rus, -rus and _rus strings.';
    promptWindow.protectLocales.ruCheckbox.value = true;
    promptWindow.protectLocales.orientation = 'column';

    promptWindow.renamingMethod = promptWindow.add('panel', undefined, 'Renaming Method:');
    promptWindow.renamingMethod.orientation = 'column';
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
    promptWindow.range.orientation = 'row';
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
    promptWindow.confirmation.orientation = 'row';
    promptWindow.confirmation.cancelButton = promptWindow.confirmation.add('button', undefined, 'Cancel', {name:'cancel'});
    promptWindow.confirmation.renameButton = promptWindow.confirmation.add('button', undefined, 'Rename', {name:'ok'});

    promptWindow.confirmation.cancelButton.onClick = doNothing;
    promptWindow.confirmation.renameButton.onClick = applyMethod;
    promptWindow.show();
}

function doNothing() {
    promptWindow.hide();
};

function setDocName() {
    var prefixName;
    if (promptWindow.includeFileName.fileNameCheckbox.value) {
        prefixName = doc.name;
        prefixName = prefixName.replace(/\..+$/, '');
        delimiter = '-';
        return prefixName;
    } else if (!promptWindow.includeFileName.fileNameCheckbox.value && promptWindow.renamingMethod.renameSame.value) {
        prefixName = 'My name is Legion, for we are many >:)';
        delimiter = '-';
        return prefixName;
    } else {
        prefixName = '';
        delimiter = '';
        return prefixName;
    }
}

function applyMethod() {
    docName = setDocName();
    var commaArray = promptWindow.range.rangeInput.text.split(',');
    var unpackedRangeArray = [];

    if (promptWindow.range.selectRange.value) {
        for (var i = 0; i < commaArray.length; i++) {
            if (commaArray[i].indexOf('-') > -1) {
                var rangeMinMax = commaArray[i].split('-');
                for (var j = parseInt(rangeMinMax[0]); j <= parseInt(rangeMinMax[rangeMinMax.length-1]); j++) {
                    unpackedRangeArray.push(j-1);
                };
            } else {
                unpackedRangeArray.push(parseInt(commaArray[i])-1);
            };
        };
    } else {
        for (var i = 0; i < doc.artboards.length; i++) {
            unpackedRangeArray.push(i);
        };
    };

    if (promptWindow.renamingMethod.renameSame.value) {
        for (var r in unpackedRangeArray) {
            var index = unpackedRangeArray[r];
            if (docName == 'My name is Legion, for we are many >:)') {
                doc.artboards[index].name = docName;
            } else {
                protectedLocale = protectLocales(doc.artboards[index].name);
                doc.artboards[index].name = docName + protectedLocale;
            }
        };
    };
    if (promptWindow.renamingMethod.renameNameNumber.value) {
        for (var r in unpackedRangeArray) {
            var index = unpackedRangeArray[r];
            protectedLocale = protectLocales(doc.artboards[index].name);
            doc.artboards[index].name = docName + delimiter + (index+1) + protectedLocale;
            };
        };
    if (promptWindow.renamingMethod.renameNameMms.value) {
        for (var r in unpackedRangeArray) {
            var index = unpackedRangeArray[r];
            var rectArray = doc.artboards[index].artboardRect;
            var widthPts = rectArray[2] - rectArray[0];
            var heightPts = (rectArray[3] - rectArray[1]) * -1;
            var widthMms = Math.round(new UnitValue(widthPts, 'pt').as('mm'));
            var heightMms = Math.round(new UnitValue(heightPts, 'pt').as('mm'));
            protectedLocale = protectLocales(doc.artboards[index].name);
            doc.artboards[index].name = docName + delimiter + widthMms + 'x' + heightMms + 'mm' + protectedLocale;
            };
        };
    if (promptWindow.renamingMethod.renameNamePxs.value) {
        for (var r in unpackedRangeArray) {
            var index = unpackedRangeArray[r];
            var rectArray = doc.artboards[index].artboardRect;
            var widthPts = rectArray[2] - rectArray[0];
            var heightPts = (rectArray[3] - rectArray[1]) * -1;
            var widthPxs = Math.round(new UnitValue(widthPts, 'pt').as('px'));
            var heightPxs = Math.round(new UnitValue(heightPts, 'pt').as('px'));
            protectedLocale = protectLocales(doc.artboards[index].name);
            doc.artboards[index].name = docName + delimiter + widthPxs + 'x' + heightPxs + 'px' + protectedLocale;
            };
        };
    promptWindow.hide();
};

function protectLocales(artboardName) {
    var protectedMatch;
    if (promptWindow.protectLocales.uaCheckbox.value && promptWindow.protectLocales.ruCheckbox.value) {
        protectedMatch = artboardName.match(/\s?-?_?ua|ua$|\s?-?_?ukr|ukr$|\s?-?_?rus|rus$|\s?-?_?ru|ru$/i);
        protectedMatch = checkNullUndefined(protectedMatch);
        return protectedMatch;
    }
    if (promptWindow.protectLocales.uaCheckbox.value) {
        protectedMatch = artboardName.match(/\s?-?_?ua|ua$|\s?-?_?ukr|ukr$/i);
        protectedMatch = checkNullUndefined(protectedMatch);
        return protectedMatch;
    }
    if (promptWindow.protectLocales.ruCheckbox.value) {
        protectedMatch = artboardName.match(/\s?-?_?rus|rus$|\s?-?_?ru|ru$/i);
        protectedMatch = checkNullUndefined(protectedMatch);
        return protectedMatch;
    }
    protectedMatch = checkNullUndefined(protectedMatch);
    return protectedMatch;

    function checkNullUndefined(checkedVariable) {
        if (checkedVariable === null || checkedVariable === undefined) {
            checkedVariable = '';
        }
        return checkedVariable;
    }
}