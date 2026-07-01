function getNextSection(lastSection) {

    if (!lastSection)
        return "A";

    return String.fromCharCode(
        lastSection.charCodeAt(0) + 1
    );

}

module.exports = {
    getNextSection
};