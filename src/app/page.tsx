import Image from "next/image";
import styles from "./page.module.css";
import { NewsWidget } from "./components/NewsWidget";

const config = {
  news: [
    {
      name: "金色财经·7*24快讯",
      api: "https://api.jinse.cn/noah/v2/lives?limit=20&reading=false&source=web&flag=down&id=0&category=0",

      map_data: "list.0.lives", // 先定位新闻列表
      map_title: "content_prefix", // 基于新闻列表的定位，下同
      map_time: "created_at",
      url_template: "https://www.jinse.com/lives/{id}.html", // 用于构建新闻链接, 括号内是动态属性属性
    },
    {
      name: "金色财经·大事件",
      api: "https://api.jinse.com/noah/v1/modules?page=1&limit=20&module_type=2",

      map_data: "data.list", // 先定位新闻列表
      map_title: "title", // 基于新闻列表的定位，下同
      map_time: "published_at",

      url_template: "https://www.jinse.cn/lives/{object_id}.html", // 用于构建新闻链接, 括号内是动态属性属性
    },
  ],
};

async function getNews(cfg: any) {
  try {
    const res = await fetch(cfg.api);

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  const responses = await Promise.allSettled(
    config.news.map((cfg) => getNews(cfg))
  );

  return (
    <main className={styles.main}>
      <div className={styles.wrapWidget}>
        {config.news.map((item, index) => (
          <NewsWidget
            key={item.api}
            data={
              responses[index].status === "fulfilled"
                ? (responses[index] as any).value
                : []
            }
            config={config.news[index]}
          ></NewsWidget>
        ))}
      </div>
    </main>
  );
}
