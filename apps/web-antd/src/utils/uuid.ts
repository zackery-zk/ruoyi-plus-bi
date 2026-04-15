// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SnowflakeId from 'snowflake-id';
// 生成唯一ID
const snowflakeId = new SnowflakeId();

/** 生成雪花ID */
export function generateId() {
  return snowflakeId.generate();
}
