import dayjs from "dayjs";
import styles from "./NewsWidget.module.scss";

/**
 * @description 将时间值转换为ms为单位的时间戳
 * @param val 参数可以是 s | ms
 * @returns ms
 */
function formatTime(val?: number | string) {
  // 数值类型的参数支持两种：秒 ｜ 毫秒
  // ms值是13位
  if (typeof val === "number") {
    return val < 1e13 ? val * 1e3 : val;
  }
  if (typeof val === "string") {
    return new Date(val).valueOf();
  }

  return Date.now();
}

function getPropertyByString(obj: any, propString: string): any {
  // 将 propString 按 "." 分隔，获取 key 及其父级对象数组
  const propArray = propString.split(".");

  // 如果 propString 只包含一个 key，则直接返回 getProperty(obj, key)
  if (propArray.length === 1) {
    return obj[propArray[0]];
  }

  // 否则，递归获取子对象的属性值
  const currentProp = propArray.shift()!;
  const childObj = obj[currentProp];
  if (!childObj) {
    return undefined;
  }
  return getPropertyByString(childObj, propArray.join("."));
}

function getUrl(url_template: string, obj: any) {
  let url = "";

  // 正则匹配插槽 {abc}
  const slotReg = /{(.+)}/; // {xxx}
  const [slot, prop] = url_template.match(slotReg) ?? [];

  // 通过插槽中定义的属性读取对象值，并构建url
  if (slot && prop) {
    const propVal = getPropertyByString(obj, prop);
    url = url_template.replace(slot, propVal);
  }

  return url;
}

export function NewsWidget({ data, config }: { data: any; config: any }) {
  const { name, url_template, map_title } = config;
  const news = getPropertyByString(data, config.map_data);

  if (!news.length) return null;

  return (
    <div className={styles.NewsWidget}>
      <h2>{name}</h2>

      <ul>
        {news.map((item: any, index: number) => (
          <li key={getUrl(url_template, item)}>
            <span className={styles.index}>{index + 1}</span>
            <a
              target="_blank"
              href={getUrl(url_template, item)}
              title={getPropertyByString(item, map_title)}
            >
              {getPropertyByString(item, map_title)}
            </a>

            <span className={styles.time}>
              {dayjs(
                formatTime(getPropertyByString(item, config.map_time))
              ).format("MM-DD hh:mm")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
