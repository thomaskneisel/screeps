module.exports = {

    sources: [],

    run: function() {
        this.sources =
            _.chain(Game.rooms)
                .forEach(function(room) {
                    console.log(room);
                })
                .map()
                .values();

        console.log(this.sources);
    }
}
