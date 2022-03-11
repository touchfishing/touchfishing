<template>
  <div>
    <v-timeline>
      <v-timeline-item
        v-for="(it, idx) in tl"
        :key="idx"
        fill-dot
        elevation="2"
        size="small"
        dot-color="#311B92"
      >
        <template v-slot:opposite>
          <span>{{ convertDate(it.level, it.time) }}</span>
        </template>
        <v-card class="elevation-2">
          <v-card-title
            :class="'text-h5 ' + (+idx % 2 === 0 ? 'odd' : 'even')"
            >{{ it.title() }}</v-card-title
          >
          <v-card-text class="pre-wrap-text">
            {{ it.content() }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import axios from "axios";
export default {
  name: "TimeLine",
  setup() {
    const store = useStore();
    var lang = ref(store.state.settings.language);
    watch(
      () => store.state.settings.language,
      (e) => {
        lang.value = e;
      }
    );

    const buyTitle = reactive([
      [
        {
          title: "小憩",
          content: (a, b) =>
            `春风拂面, 朝气彭发\n今日消费 ${a} 原石, \n百忙偷闲之中, 与 #${b}# 一起摸鱼`,
        },
        {
          title: "闲资",
          content: (a, b) =>
            `貌似已过了发工资的日子, \n但钱包还是有些鼓起\n遂于此消费 ${a} 原石, \n不经意的砸向了 #${b}# `,
        },
        {
          title: "相拥",
          content: (a, b) =>
            `在这个特俗的日子, \n与 #${b}# 在摸鱼中相遇\n或许轻轻巧巧的用去 ${a} 原石, \n使得每个日子都显得无比特别?`,
        },
        {
          title: "享用",
          content: (a, b) =>
            `在屏下特别光顾了 #${b}# \n 可能店主也特别青睐你, \n收取了 ${a} 原石, 留下纸条: \n'祝你好运, 下次光临时别歪了池子'`,
        },
        {
          title: "渔获",
          content: (a, b) =>
            `小心翼翼的摸鱼终于有了不错的收获\n据说老板发工资了\n你跑遍了摸渔世界, 跨过了无数个时空\n经过 #${b}# , 一共砸下 ${a} 原石\n许下了收获的祈愿`,
        },
        {
          title: "修仙",
          content: (a, b) =>
            `奔波劳碌, 忙里偷闲, 又是一日摸渔羡\n 放手一挥, ${a} 原石去, \n途径小店, #${b}# \n默默祈愿: \n『一发紫气东来, \n二发金碧辉煌』`,
        },
      ],
      [
        {
          title: "Meditation",
          content: (a, b) =>
            `Take a break and enjoy today. \nSpent ${a} Primogems, \ntouching fishing with #${b}# `,
        },
        {
          title: "Freedom",
          content: (a, b) =>
            `Seems it's been a while receiving wage... \nBut the wallet seems even stronger\nWhen you spent ${a} Primogems, \naccidentally dropping by #${b}# `,
        },
        {
          title: "Embrace",
          content: (a, b) =>
            `Special day, \nwith #${b}# in touch fishing\nyou dropped ${a} Primogems, \nand perhaps that's what makes today special?`,
        },
        {
          title: "Enjoyment",
          content: (a, b) =>
            `Encounter with #${b}# \n Consuming ${a} Primogems\nNote: \n'Good luck. Don't get lost next time.'`,
        },
        {
          title: "Harvest",
          content: (a, b) =>
            `Harvest season in touch fishing! \nReceiving great Salary! \nRun through all the touch fishing, turning all the wheel\nPassing #${b}# , giving away ${a} Primogems\nYou make a wish`,
        },
        {
          title: "Above",
          content: (a, b) =>
            `Another day in touch fishing\n When ${a} Primogems is nearly nothing \nA great fortune #${b}# brings\nWish pull: \n"Purple it goes, \nGolden comes next"`,
        },
      ],
    ]);
    const otherWords = [
      {
        arrival: {
          title: "降临",
          content:
            "这一天, 你来到了摸渔的世界; \n但或许, 早在很久以前, 你就有了与🐟的相遇",
        },
        around: {
          title: "环顾",
          content: "以吾之契, 尔为商人\n钱来运转, 渔水高升",
        },
        await: {
          title: "期待🐟未来",
          content: () =>
            `🐟🐟🐟\n看着日历, ${expectWeekend()}\n又是一个等待工资的日子啊\n🐟🐟🐟🐟🐟🐟`,
        },
      },
      {
        arrival: {
          title: "Arrival",
          content:
            "You arrived touch fishing this day. \nBut perhaps, long before, \nyou've already get 🐟's acquaintance?",
        },
        around: {
          title: "Around",
          content:
            "By contract you became a merchant\nBy earning you touched the fishing",
        },
        await: {
          title: "Await🐟",
          content: () =>
            `🐟🐟🐟\nLook at the calendar,\n ${expectWeekend()}\nAnother day awaiting salary\n🐟🐟🐟🐟🐟🐟`,
        },
      },
    ];

    const tl = reactive([]);
    // come to
    tl.push({
      time: new Date(store.state.login.create_time).getTime(),
      level: 0,
      title: () => otherWords[lang.value].arrival.title,
      content: () => otherWords[lang.value].arrival.content,
    });
    // open a shop
    if (store.state.store) {
      tl.push({
        time: new Date(store.state.store.create_time).getTime(),
        level: 0,
        title: () => otherWords[lang.value].around.title,
        content: () => otherWords[lang.value].around.content,
      });
    }

    // today
    tl.push({
      time: new Date().getTime(),
      level: 0,
      title: () => otherWords[lang.value].await.title,
      content: () => otherWords[lang.value].await.content(),
    });

    // analyse order
    axios
      .get(store.getters.UrlOrder("list"), {
        withCredentials: true,
        headers: {
          cookie: store.getters.LoginSession,
        },
      })
      .then((res) => {
        if (res.status === 200 && res.data.code === 200) {
          const os = handleOrder(res.data.data.orders);
          for (let i of os) {
            tl.push({
              time: +i.time,
              level: 0,
              title: () => buyTitle[lang.value][buyLv(i.price)].title,
              content: () =>
                buyTitle[lang.value][buyLv(i.price)].content(i.price, i.store),
            });
          }
          tl.sort((a, b) => a.time - b.time);
        }
      });

    function convertDate(lv, d) {
      let t = new Date(d);
      if (lv === 0)
        return `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`;
    }

    let ttt = 1000 * 60 * 60 * 24;
    function getPureDay(a) {
      return Math.floor(a / ttt) * ttt;
    }

    function handleOrder(d) {
      if (d.length === 0) return;
      d.sort(
        (a, b) =>
          new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
      );
      d.map((x) => (x.DD = getPureDay(new Date(x.create_time).getTime())));
      let tmp = {};
      for (let i of d) {
        if (tmp[i.DD]) {
          tmp[i.DD].price += i.price;
          if (tmp[i.DD].store[i.sid]) {
            tmp[i.DD].store[i.sid].cnt++;
          } else {
            tmp[i.DD].store[i.sid] = { cnt: 0, sname: i.sname };
          }
        } else {
          tmp[i.DD] = { price: 0, store: {} };
          tmp[i.DD].store[i.sid] = { cnt: 0, sname: i.sname };
        }
      }
      let tmp2 = [];
      for (const k in tmp) {
        let mx = 0,
          ms = "";
        for (let i in tmp[k].store) {
          if (tmp[k].store[i].cnt > mx) {
            mx = tmp[k].store[i].cnt;
            ms = tmp[k].store[i].sname;
          }
        }
        tmp2.push({
          time: +k,
          price: tmp[k].price,
          store: ms,
        });
      }
      return tmp2;
    }

    function buyLv(p) {
      let i = 0;
      if (p >= 300 && p < 1000) i = 1;
      else if (p >= 1000 && p < 3000) i = 2;
      else if (p >= 3000 && p < 9000) i = 3;
      else if (p >= 9000 && p < 15000) i = 4;
      else if (p >= 15000) i = 5;
      return i;
    }

    const expectw = [
      {
        1: (d) => `坚持一下, 还有 ${d} 天就是周末了`,
        0: "胜利在望, 明天就是周末了! ",
        "-1": "今日周六, 适合在家摸鱼",
        "-2": "周日, 只要不是周一, 那就继续愉快的休息",
        other: "好像没什么特殊的",
      },
      {
        1: (d) => `Hold on, ${d} days to weekend! `,
        0: "Victory's around the corner! Tomorrow weekend comes!",
        "-1": "Saturday it is. Should be free at home.",
        "-2": "Sunday makes it distant from Monday.",
        other: "Nothing special?",
      },
    ];
    function expectWeekend() {
      let dd = 5 - new Date().getDay();
      if (dd > 0) return expectw[lang.value]["1"](dd);
      else if (dd <= 0 && dd >= -2) expectw[lang.value][String(dd)];
      return expectw[lang.value].other;
    }

    return { tl, convertDate };
  },
};
</script>

<style scoped>
.odd {
  flex-direction: row;
}
.even {
  flex-direction: row-reverse;
}
</style>