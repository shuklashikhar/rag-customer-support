export interface ILoader {
  load(source: string): Promise<string>
}