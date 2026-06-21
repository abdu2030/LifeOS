import { defaultFinanceCategories } from '../data/financeCategories'
import type { TransactionType } from '../types/finance'

const categoryGroups: TransactionType[] = ['income', 'expense', 'transfer']

export function CategoryManager() {
  return (
    <section className="finance-panel category-manager">
      <div>
        <span className="auth-eyebrow">Categories</span>
        <h2>Category manager</h2>
        <p>Start with clean defaults, then expand categories as LifeOS grows.</p>
      </div>

      <div className="category-columns">
        {categoryGroups.map((group) => {
          const categories = defaultFinanceCategories.filter((category) => category.type === group)

          return (
            <div className="category-column" key={group}>
              <strong>{group}</strong>
              {categories.length ? (
                categories.map((category) => (
                  <span key={category.id}>
                    <i style={{ background: category.color }} />
                    {category.name}
                  </span>
                ))
              ) : (
                <small>No default categories yet</small>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
