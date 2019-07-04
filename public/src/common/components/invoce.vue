<template>
    <div>
        <select v-model="invoceMonth">
            <option value="2019.01 to 2019.02">2019年01-02月</option>
            <option value="2019.03 to 2019.04">2019年03-04月</option>
            <option value="2019.05 to 2019.06">2019年05-06月</option>
            <option value="2019.07 to 2019.08">2019年07-08月</option>
            <option value="2019.09 to 2019.10">2019年09-10月</option>
            <option value="2019.11 to 2019.12">2019年11-12月</option>
        </select>
        <button @click="getInvoce">search</button>
        <span>{{winningAmount}}</span>
        <table>
            <tr>
                <td>日期</td>
                <td>編號</td>
            </tr>
            <tr v-for="data in winningData">
                <td>{{data.date}}</td>
                <td>{{data.number}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "invoce",
        mounted() {
        },
        data() {
            return {
                isWinning: false,
                winningaAmount: 0,
                invoceMonth: "",
                winningData: []
            }
        },
        methods: {
            async getInvoce() {
                let param = {
                    month: this.invoceMonth
                };

                try {
                    let doRule = await axios.post("/api/invoceRule", param);
                    let ruleData = doRule != null ? doRule.data : {};
                    this.winningData = ruleData.winningData;
                    this.winningAmount = ruleData.winningAmount;
                } catch (err) {
                    let msg = err.message || err;
                    alert(msg);
                }

            }
        }
    }
</script>