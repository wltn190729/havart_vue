<template>
  <div>
    <table class="tb">
      <tr>
        <th>총 설치수</th>
        <td class="text-end">{{numberFormat(listData.totalCount)}}</td>
        <th>검색기간</th>
        <td class="W120">
          <input type="date" v-model.trim="filters.startDate" />
        </td>
        <td class="W120">
          <input type="date" v-model.trim="filters.endDate" />
        </td>
        <td class="W140">
          <v-btn-toggle>
            <v-btn small @click="setDate('today')">오늘</v-btn>
            <v-btn small @click="setDate('weekAgo')">이번주</v-btn>
            <v-btn small @click="setDate('monthAgo')">한달전</v-btn>
            <v-btn small @click="setDate('month3Ago')">3개월전</v-btn>
          </v-btn-toggle>
        </td>
        <td>
          <v-btn color="secondary" small elevation="0" @click="GetStatics"><v-icon>mdi-magnify</v-icon> 날짜적용</v-btn>
        </td>
      </tr>

    </table>
    <table class="tb mt-2" v-if="ui.isDataLoaded">
      <tr>
        <th>총 회원수</th>
        <td class="W100 text-end">{{numberFormat(usersData.summary.total)}}</td>
        <th>검색기간 가입</th>
        <td class="W100 text-end">{{numberFormat(usersData.summary.period)}}</td>
        <th>신규 문의</th>
        <td class="W100 text-end">{{numberFormat(inquiryData.summary.wait)}}</td>
        <th>진행중 문의</th>
        <td class="W100 text-end">{{numberFormat(inquiryData.summary.progress)}}</td>
        <td></td>
      </tr>
    </table>
    <template v-if="ui.isDataLoaded">
      <div class="d-flex mt-2">
        <div class="W500">
          <table class="tb">
            <thead>
            <tr>
              <th class="W120">일자</th>
              <th class="W100">어플 접속</th>
              <th class="W100">신규 설치</th>
              <th class="W100">회원 가입</th>
              <th class="W100">총 세션</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in complexList" :key="`statics-list-${index}`">
              <td class="text-center">{{item.date.dateFormat('yyyy-MM-dd (e)')}}</td>
              <td class="text-end">{{numberFormat(item.activeUsers)}}</td>
              <td class="text-end">{{numberFormat(item.newUsers)}}</td>
              <td class="text-end">{{numberFormat(item.regUser)}}</td>
              <td class="text-end">{{numberFormat(item.sessions)}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div style="flex:1;padding-left:1rem;">
          <ul class="chart-menu">
            <li :class="{active:ui.selectedKey === 'newUsers'}" @click="ui.selectedKey='newUsers'">신규 설치</li>
            <li :class="{active:ui.selectedKey === 'activeUsers'}" @click="ui.selectedKey='activeUsers'">어플 접속</li>
            <li :class="{active:ui.selectedKey === 'regUser'}" @click="ui.selectedKey='regUser'">회원가입</li>
            <li :class="{active:ui.selectedKey === 'sessions'}" @click="ui.selectedKey='sessions'">총 세션</li>
          </ul>

          <div class="mt-2">
            <bar :height="500" :data="chartData" :options="chartOption" />
          </div>

        </div>
      </div>

      <div class="mt-5"></div>

      <div class="d-flex">
        <h4>최근 문의 내역</h4>
        <v-btn small elevation="0" color="secondary" to="/board" icon><v-icon>mdi-open-in-new</v-icon></v-btn>
      </div>

      <table class="tb" style="table-layout: auto">
        <thead>
        <tr>
          <th class="W80">진행상태</th>
          <th style="width:auto;">문의내용</th>
          <th class="W160">작성일시</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="inquiryData.recentList.length>0">
          <tr v-for="(item,index) in inquiryData.recentList" :key="`inquiry-${index}`">
            <td class="text-center"><v-chip dark label small
                        :color="item.state==='done'?'green': (
                    item.state==='cancel'?'red': (
                        item.state==='progress'?'primary': 'secondary'))">
              <template v-if="item.state==='progress'">진행중</template>
              <template v-else-if="item.state==='wait'">대기중</template>
              <template v-else-if="item.state==='done'">완료</template>
              <template v-else-if="item.state==='cancel'">취소</template>
            </v-chip></td>
            <td>{{item.comment}}</td>
            <td>{{item.regDt}}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="3" class="empty">최근 문의내역이 없습니다.</td>
          </tr>
        </template>
        </tbody>
      </table>

    </template>
    <template v-else>
      <loading-bar />
    </template>
  </div>
</template>
<style lang="scss" scoped>

.chart-menu {
  list-style:none;
  padding:0;
  margin:0;
  display:flex;
  align-items: center;
  border-bottom:1px solid #cecece;

  li {
    display:block;
    padding:.25rem .5rem;
    border:1px solid #cecece;
    background:#f0f0f0;
    cursor:pointer;
    font-size:13px;
    margin-bottom:-1px;
    margin-right:-1px;

    &.active {
      background-color:#fff;
      border-bottom:1px solid transparent;
      cursor:default;
    }
  }
}

.empty {
  width:100%;
  font-size:17px;
  color:#787878;
  font-weight:400;
  display:flex;
  justify-content: center;
  align-items: center;
  height:150px;
}
</style>
<script>
import staticsModel from '@/models/statics.model'
import LoadingBar from "@/views/BackOffice/Components/LoadingBar";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {Bar} from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export default {
  name: 'DashboardView',
  components: {LoadingBar, Bar},
  data() {
    return{
      ui: {
        isDataLoaded: false,
        selectedKey: 'newUsers'
      },
      filters: {
        endDate:  this.dayList.today,
        startDate: this.dayList.weekAgo
      },
      listData: {
        result: [],
        totalCount: 0
      },
      usersData: {
        result: []
      },
      inquiryData: {
        summary: {
          wait: 0,
          progress: 0,
        },
        recentList: [],
      }
    }
  },
  mounted() {
    this.GetStatics();
    this.GetInquiry();
  },
  computed: {
    complexList () {
      const list = JSON.parse(JSON.stringify(this.listData.result))

      for(let i in this.usersData.result) {
        const t = list.find(item=>item.date === this.usersData.result[i].date)
        if(t !== null && t !== undefined) {
          t.regUser = (this.usersData.result[i].value * 1)
        }
      }

      for(let i in list) {
        if(typeof list[i].regUser === 'undefined') {
          list[i].regUser = 0
        }
      }

      return list
    },
    chartOption () {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    },
    chartData () {
      let returnData = {
        labels: [],
        datasets: [
          {label: {newUsers:'신규 사용자', activeUsers:'접속자',sessions:'총 세션', regUser:'회원 가입'  }[this.ui.selectedKey], data: [], backgroundColor: '#1abc9c'}
        ]
      };

      for(let k in this.complexList) {
        returnData.labels.push( this.complexList[k].date );
        returnData.datasets[0].data.push( this.complexList[k][this.ui.selectedKey] );
      }

      return returnData;
    }
  },
  methods: {
    GetInquiry () {
      staticsModel.getInquiry().then(res => {
        this.inquiryData = res
      })
    },
    GetStatics () {
      this.ui.isDataLoaded = false
      staticsModel.getStatics({
        startDate: this.filters.startDate,
        endDate: this.filters.endDate
      }).then(res => {
        this.listData.result = res.data
        this.listData.totalCount = res.totalCount
        this.ui.isDataLoaded = true
      })

      staticsModel.getUserStatics({
        startDate: this.filters.startDate,
        endDate: this.filters.endDate
      }).then(res=> {
        this.usersData.result = res.result;
        this.usersData.summary = res.summary;
      })
    },
    setDate (key) {
      this.filters.startDate = this.dayList[key]
      this.filters.endDate = this.dayList.today
    }
  }
}
</script>