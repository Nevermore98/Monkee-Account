export const typeMap = {
  1: {
    icon: 'food'
  },
  2: {
    icon: 'clothes'
  },
  3: {
    icon: 'traffic'
  },
  4: {
    icon: 'daily-consumption'
  },
  5: {
    icon: 'shopping'
  },
  6: {
    icon: 'education'
  },
  7: {
    icon: 'medication'
  },
  8: {
    icon: 'travel'
  },
  9: {
    icon: 'interpersonal'
  },
  10: {
    icon: 'other-expense'
  },
  11: {
    icon: 'salary'
  },
  12: {
    icon: 'bonus'
  },
  13: {
    icon: 'transfer'
  },
  14: {
    icon: 'financial'
  },
  15: {
    icon: 'refund'
  },
  16: {
    icon: 'other-income'
  }
}

// 直接操作 DOM 实现切换确认键颜色
export const changeConfirmButtonColor = (type: string) => {
  const button: HTMLElement | null = document.querySelector('.van-key--blue')
  if (button) {
    if (type === 'expense') {
      button.style.background = '#39be77'
    } else {
      button.style.background = '#ecbe25'
    }
  }
}
