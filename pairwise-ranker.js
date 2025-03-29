class PairwiseRanker {
    constructor(items) {
        this.items = items;
        this.comparisons = [];
        this.rankings = {};
        this.currentPair = null;
        this.resetState();
    }

    resetState() {
        this.remainingPairs = [];
        for (let i = 0; i < this.items.length; i++) {
            for (let j = i + 1; j < this.items.length; j++) {
                this.remainingPairs.push([this.items[i], this.items[j]]);
            }
        }
        this.shuffleArray(this.remainingPairs);
        
        this.items.forEach(item => {
            this.rankings[item] = { wins: 0, losses: 0 };
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getNextPair() {
        if (this.remainingPairs.length === 0) return null;
        this.currentPair = this.remainingPairs.pop();
        return this.currentPair;
    }

    recordChoice(winner) {
        const [item1, item2] = this.currentPair;
        if (winner === item1) {
            this.rankings[item1].wins++;
            this.rankings[item2].losses++;
        } else {
            this.rankings[item2].wins++;
            this.rankings[item1].losses++;
        }
    }

    getRankings() {
        return this.items.slice().sort((a, b) => {
            const scoreA = this.rankings[a].wins - this.rankings[a].losses;
            const scoreB = this.rankings[b].wins - this.rankings[b].losses;
            return scoreB - scoreA;
        });
    }

    getProgress() {
        const totalPairs = (this.items.length * (this.items.length - 1)) / 2;
        const completed = totalPairs - this.remainingPairs.length;
        return {
            completed,
            total: totalPairs,
            percent: Math.round((completed / totalPairs) * 100)
        };
    }
}