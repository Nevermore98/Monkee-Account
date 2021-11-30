/** 账单类型*/
export interface BillType {
  id: number // 0 表示全部类型
  name: string
  type?: '1' | '2' // '1' 为支出，'2'为收入
}

/** 单日账单单条记录 */
export interface DayBillItem {
  id?: number // 单条记录的 id
  pay_type?: 1 | 2
  amount?: string
  date?: string // 时间戳
  type_id?: number
  type_name?: string
  remark?: string
}

/** 单日账单全部记录 */
export type DayBillItems = DayBillItem[]

/** 某日账单 */
export interface DayBillList {
  date: string // 年月日
  bills: DayBillItems
}

/** 多日账单 */
export type BillList = DayBillList[]

/** 请求到的数据 */
export interface RequestData {
  list: BillList
  totalExpense: number
  totalIncome: number
  totalPage: number
}
