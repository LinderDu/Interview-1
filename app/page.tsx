'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx';
import './home.css'

interface ILoginParams {
  mobile: number;
  code: string;
}

export default function Home() {
  const ref = useRef<NodeJS.Timeout | null>(null);
  const [mobile, setMobile] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [mobileError, setMobileError] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const mockFetch = async (params: ILoginParams) => {
    return new Promise((resolve) => {
      ref.current = setTimeout(() => {
        return resolve({ mobile: params.mobile, code: params.code });
      }, 1000);
    });
  }

  const validateMobile = (value: string) => {
    if (!value) {
      setMobileError('请输入手机号');
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(value)) {
      setMobileError('手机号格式错误');
      return false;
    }
    setMobileError('');
    return true;
  };

  const validateCode = (value: string) => {
    if (!value) {
      setCodeError('请输入验证码');
      return false;
    }
    if (!/^\d{6}$/.test(value)) {
      setCodeError('验证码格式错误');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateMobile(mobile) || !validateCode(code)) return;
    
    setIsSubmitting(true);
    try {
      const res = await mockFetch({ mobile: Number(mobile), code });
      console.log(res);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    return () => {
      if (ref.current) {
        clearTimeout(ref.current);
      }
    }
  }, [])


  return (
    <form onSubmit={handleSubmit}>
      <div className="form-item">
        <input 
          placeholder="手机号" 
          name="mobile" 
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            validateMobile(e.target.value);
          }}
        />
        {mobileError && <p className="form-error">{mobileError}</p>}
      </div>

      <div className="form-item">
        <div className="input-group">
          <input 
            placeholder="验证码" 
            name="code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              validateCode(e.target.value);
            }}
          />
          <button 
            className={clsx('getcode', {
              'disabled':!mobile || !!mobileError
            })} 
            type="button"
            disabled={!mobile || !!mobileError}
          >
            获取验证码
          </button>
        </div>
        {codeError && <p className="form-error">{codeError}</p>}
      </div>

      <button className="submit-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'submiting......' : '登录'}
      </button>
    </form>
  );
}
