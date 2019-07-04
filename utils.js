module.exports = {
    mongoDocToObject: (mongoDataRows) => {
        if (mongoDataRows != null) {
            try {
                if (Array.isArray(mongoDataRows)) {
                    mongoDataRows.forEach((row, idx) => {
                        mongoDataRows[idx] = row.toObject();
                    });
                } else {
                    mongoDataRows = mongoDataRows._doc || mongoDataRows.toObject();
                }

            } catch (ex) {
                console.error(ex);
            }
        }

        return mongoDataRows;
    }
};