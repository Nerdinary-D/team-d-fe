'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import type { OnCompleteParams } from '@actbase/react-daum-postcode/lib/types';
import { Camera, ChevronDown } from 'lucide-react';
import { BottomCTA } from '@/components/common/BottomCTA';
import { Dialog, DialogContent, DialogTitle } from '@/components/common/Dialog';
import { Textfield } from '@/components/common/Textfield';
import { cn } from '@/lib/utils';

type BasicFormState = {
  address: string;
  imageFile: File | null;
  imagePreviewUrl: string;
  region: string;
  sport: string;
  title: string;
};

type EnvironmentItem = {
  id: string;
  label: string;
  selected: boolean;
};

type EnvironmentGroup = {
  icon: string;
  items: EnvironmentItem[];
  title: string;
};

type SelectFieldProps = {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  value: string;
};

const TOTAL_STEPS = 3;
const SPORTS = ['탁구', '배드민턴', '테니스', '농구'];
const REGIONS = ['서울 은평구', '서울 마포구', '서울 서대문구', '경기 고양시'];
const KAKAO_POSTCODE_SCRIPT_ID = 'kakao-postcode-sdk';
const KAKAO_POSTCODE_SCRIPT_SRC =
  'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
const KAKAO_POSTCODE_ORIGIN = 'https://postcode.map.kakao.com';

type KakaoPostcodeConstructor = new (options: Record<string, unknown>) => {
  embed: (
    element: HTMLElement,
    options?: { autoClose?: boolean; q?: string },
  ) => void;
};

const initialBasicForm: BasicFormState = {
  address: '',
  imageFile: null,
  imagePreviewUrl: '',
  region: '',
  sport: '',
  title: '',
};

const environmentSteps: EnvironmentGroup[][] = [
  [
    {
      icon: '🧠',
      title: '지체장애를 위한 환경이에요.',
      items: [
        {
          id: 'step-free-entry',
          label: '단차없는 휠체어 진입',
          selected: true,
        },
        {
          id: 'equipment-rental',
          label: '스포츠 휠체어 및 맞춤 장비대여',
          selected: true,
        },
        {
          id: 'accessible-changing-room',
          label: '휠체어 전용 탈의실 및 샤워실',
          selected: false,
        },
      ],
    },
    {
      icon: '👀',
      title: '시각장애를 위한 환경이에요.',
      items: [
        { id: 'guide-dog-entry', label: '안내견 동반 환영', selected: true },
        {
          id: 'braille-blocks-and-signage',
          label: '점자블록, 점자 안내판 설치',
          selected: false,
        },
        {
          id: 'staff-verbal-guidance',
          label: '직원 구두 안내 도움가능',
          selected: false,
        },
      ],
    },
  ],
  [
    {
      icon: '👂🏻',
      title: '청각장애를 위한 환경이에요.',
      items: [
        {
          id: 'writing-or-tablet',
          label: '필담/태블릿 소통 가능',
          selected: true,
        },
        {
          id: 'visual-guide',
          label: '글/그림 위주 시각안내 자료',
          selected: true,
        },
        {
          id: 'visual-alert',
          label: '비상시 시각 알람 제공',
          selected: true,
        },
      ],
    },
    {
      icon: '👣',
      title: '발달장애를 위한 환경이에요.',
      items: [
        {
          id: 'simple-content',
          label: '단순하고 직관적인 컨텐츠',
          selected: true,
        },
        {
          id: 'low-stimulation',
          label: '감각적 자극이 적은 차분한 환경',
          selected: false,
        },
        {
          id: 'private-space',
          label: '독립적인 운동공간 제공',
          selected: false,
        },
      ],
    },
  ],
];

function toShortSido(sido: string) {
  const sidoMap: Record<string, string> = {
    서울특별시: '서울',
    부산광역시: '부산',
    대구광역시: '대구',
    인천광역시: '인천',
    광주광역시: '광주',
    대전광역시: '대전',
    울산광역시: '울산',
    경기도: '경기',
    강원특별자치도: '강원',
    충청북도: '충북',
    충청남도: '충남',
    전북특별자치도: '전북',
    전라남도: '전남',
    경상북도: '경북',
    경상남도: '경남',
  };

  return sidoMap[sido] ?? sido;
}

function getRegionFromPostcodeData(data: OnCompleteParams) {
  const sido = toShortSido(data.sido ?? '');
  const sigungu = data.sigungu ?? '';

  return [sido, sigungu].filter(Boolean).join(' ');
}

function isLocalHttpPostcodeContext() {
  if (typeof window === 'undefined') {
    return false;
  }

  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

  return (
    window.location.protocol === 'http:' &&
    localHosts.has(window.location.hostname)
  );
}

function createLocalPostcodeFrameUrl() {
  const params = new URLSearchParams({
    origin: window.location.origin,
    inc: '',
    inch: '80',
    inct: '구 도메인 리소스 삭제 안내 (5/12 15시): 개발자분들께서는 공지사항을 참고하여 사전에 도메인 전환 조치를 완료해 주시기 바랍니다.',
    incf: '15',
    indaum: 'off',
    banner: 'on',
    ubl: 'on',
    mode: 'transmit',
    vt: 'layer',
    amr: 'on',
    amj: 'on',
    ani: 'on',
    sd: 'on',
    fi: 'on',
    fc: 'on',
    plrg: '',
    plrgt: '1.5',
    hmb: 'on',
    heb: 'off',
    asea: 'off',
    smh: 'off',
    zo: 'on',
    us: 'on',
    msi: '10',
    ahs: 'off',
    whas: '500',
    sm: 'on',
    a51: 'off',
    zn: 'Y',
    fullpath: window.location.pathname,
  });

  return `${KAKAO_POSTCODE_ORIGIN}/search?${params.toString()}`;
}

function decodePostcodeMessage(data: string) {
  return data.split('|').reduce<Record<string, string>>((acc, item) => {
    const [key, value = ''] = item.split('=');

    if (!key) {
      return acc;
    }

    try {
      acc[key] = decodeURIComponent(value.replace(/\+/g, ' '));
    } catch {
      acc[key] = value.replace(/\+/g, ' ');
    }

    return acc;
  }, {});
}

function getKakaoPostcodeConstructor() {
  const apiWindow = window as typeof window & {
    daum?: { Postcode?: KakaoPostcodeConstructor };
    kakao?: { Postcode?: KakaoPostcodeConstructor };
  };

  return apiWindow.kakao?.Postcode ?? apiWindow.daum?.Postcode ?? null;
}

function loadKakaoPostcodeScript() {
  const Postcode = getKakaoPostcodeConstructor();

  if (Postcode) {
    return Promise.resolve(Postcode);
  }

  const existingScript = document.getElementById(
    KAKAO_POSTCODE_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  return new Promise<KakaoPostcodeConstructor>((resolve, reject) => {
    const script = existingScript ?? document.createElement('script');
    const timers: { poll?: number } = {};

    const cleanup = () => {
      window.clearInterval(timers.poll);
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };

    const resolveIfReady = () => {
      const loadedPostcode = getKakaoPostcodeConstructor();

      if (!loadedPostcode) {
        return false;
      }

      cleanup();
      resolve(loadedPostcode);

      return true;
    };

    const handleLoad = () => {
      if (!resolveIfReady()) {
        cleanup();
        reject(new Error('Kakao postcode script loaded without Postcode API.'));
      }
    };

    const handleError = () => {
      cleanup();
      reject(new Error('Failed to load Kakao postcode script.'));
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    timers.poll = window.setInterval(resolveIfReady, 100);

    if (!existingScript) {
      script.id = KAKAO_POSTCODE_SCRIPT_ID;
      script.src = KAKAO_POSTCODE_SCRIPT_SRC;
      script.async = true;
      script.dataset.kakaoPostcodeSdk = 'true';
      document.head.appendChild(script);
    }
  });
}

function LocalHttpPostcodeFrame({
  onSelected,
}: {
  onSelected: (data: OnCompleteParams) => void;
}) {
  const src =
    typeof window === 'undefined' ? '' : createLocalPostcodeFrameUrl();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== KAKAO_POSTCODE_ORIGIN ||
        typeof event.data !== 'string'
      ) {
        return;
      }

      const postcodeData = decodePostcodeMessage(event.data);

      if (postcodeData.action !== 'done') {
        return;
      }

      onSelected(postcodeData as unknown as OnCompleteParams);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSelected]);

  const frame = src ? (
    <iframe
      title="우편번호 검색 프레임"
      src={src}
      className="size-full border-0"
    />
  ) : (
    <div className="flex h-full items-center justify-center text-body2 text-gray-500">
      주소 검색을 불러오는 중입니다.
    </div>
  );

  return frame;
}

function OfficialPostcodeEmbed({
  onSelected,
}: {
  onSelected: (data: OnCompleteParams) => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let isActive = true;

    loadKakaoPostcodeScript()
      .then((Postcode) => {
        if (!isActive || !layerRef.current) {
          return;
        }

        layerRef.current.innerHTML = '';

        new Postcode({
          animation: true,
          height: '100%',
          hideMapBtn: true,
          oncomplete: onSelected,
          width: '100%',
        }).embed(layerRef.current, { autoClose: false });
      })
      .catch(() => {
        if (isActive) {
          setHasLoadError(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [onSelected]);

  const loadingState = hasLoadError ? (
    <div className="flex h-full items-center justify-center text-body2 text-gray-500">
      주소 검색을 불러오지 못했습니다.
    </div>
  ) : (
    <div className="flex h-full items-center justify-center text-body2 text-gray-500">
      주소 검색을 불러오는 중입니다.
    </div>
  );

  const embed = (
    <div ref={layerRef} className="size-full">
      {loadingState}
    </div>
  );

  return embed;
}

function StepProgress({ currentStep }: { currentStep: number }) {
  const segments = Array.from({ length: TOTAL_STEPS }, (_, index) => {
    const isActive = index < currentStep;

    return (
      <span
        key={index}
        aria-hidden
        className={cn(
          'h-1 min-w-0 flex-1 rounded-[40px]',
          isActive ? 'bg-main' : 'bg-onboarding-progress-inactive',
        )}
      />
    );
  });

  const progressBar = (
    <div aria-hidden className="flex w-full items-center gap-2.5">
      {segments}
    </div>
  );

  const stepLabel = (
    <p className="text-subtitle1 self-end text-onboarding-progress-total">
      <span className="text-main">{currentStep}</span>
      <span>/{TOTAL_STEPS}</span>
    </p>
  );

  const progress = (
    <div
      role="progressbar"
      aria-label={`${currentStep}/${TOTAL_STEPS} 단계`}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-valuenow={currentStep}
      className="flex w-full flex-col gap-2"
    >
      {progressBar}
      {stepLabel}
    </div>
  );

  return progress;
}

function SelectField({
  label,
  onChange,
  options,
  placeholder,
  value,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();
  const selectedLabel = value || placeholder;

  const optionItems = isOpen ? (
    <div
      id={listboxId}
      role="listbox"
      className="absolute top-[74px] right-0 left-0 z-20 overflow-hidden rounded-[10px] border border-gray-400 bg-white shadow-lg"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="option"
          aria-selected={option === value}
          className="block w-full px-4 py-3 text-left text-subtitle2 text-gray-800 hover:bg-gray-100"
          onClick={() => {
            onChange(option);
            setIsOpen(false);
          }}
        >
          {option}
        </button>
      ))}
    </div>
  ) : null;

  const field = (
    <div className="-mx-1 flex flex-col gap-1.5 px-1">
      <p className="text-body2 text-gray-500">{label}</p>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          className={cn(
            'flex h-[50px] w-full items-center justify-between rounded-[10px] border border-gray-400 bg-white px-4 py-[15px] text-left text-subtitle2 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
            value ? 'text-gray-800' : 'text-gray-400',
          )}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span>{selectedLabel}</span>
          <ChevronDown aria-hidden className="size-4 text-gray-400" />
        </button>
        {optionItems}
      </div>
    </div>
  );

  return field;
}

function ImageUploadField({
  previewUrl,
  onImageChange,
}: {
  previewUrl: string;
  onImageChange: (file: File) => void;
}) {
  const inputId = useId();

  const preview = previewUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- File previews use browser-created blob URLs.
    <img
      src={previewUrl}
      alt="업로드한 시설 대표 이미지"
      className="absolute inset-0 size-full rounded-[10px] object-cover"
    />
  ) : null;

  const emptyState = previewUrl ? null : (
    <span className="flex flex-col items-center gap-2 text-center text-subtitle2 text-gray-400">
      <Camera aria-hidden className="size-6 text-gray-500" />
      <span>
        시설을 대표하는 이미지를
        <br />
        업로드 해 주세요!
      </span>
    </span>
  );

  const field = (
    <div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        aria-label="시설 대표 이미지"
        className="sr-only"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const file = event.currentTarget.files?.[0];

          if (file) {
            onImageChange(file);
          }
        }}
      />
      <label
        htmlFor={inputId}
        className="relative flex h-[193px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-gray-400 bg-gray-100"
      >
        {preview}
        {emptyState}
      </label>
    </div>
  );

  return field;
}

function AddressSearchField({
  value,
  onSelected,
}: {
  value: string;
  onSelected: (
    partialState: Pick<BasicFormState, 'address' | 'region'>,
  ) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const useLocalHttpFrame = isOpen && isLocalHttpPostcodeContext();

  const handleSelected = useCallback(
    (data: OnCompleteParams) => {
      const address = data.address || data.roadAddress || data.jibunAddress;
      const region = getRegionFromPostcodeData(data);

      onSelected({ address, region });
      setIsOpen(false);
    },
    [onSelected],
  );

  const addressInput = (
    <Textfield
      readOnly
      label="상세 주소"
      placeholder="예: 서울시 은평구 연서로 36"
      value={value}
      className="cursor-pointer"
      onClick={() => setIsOpen(true)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsOpen(true);
        }
      }}
    />
  );

  const postcodeDialog = isOpen ? (
    <Dialog open onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[328px] gap-3 p-4" aria-label="주소 검색">
        <DialogTitle className="text-header2">주소 검색</DialogTitle>
        <div className="h-[430px] overflow-hidden rounded-[10px] border border-gray-300">
          {useLocalHttpFrame ? (
            <LocalHttpPostcodeFrame onSelected={handleSelected} />
          ) : (
            <OfficialPostcodeEmbed onSelected={handleSelected} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  ) : null;

  const field = (
    <>
      {addressInput}
      {postcodeDialog}
    </>
  );

  return field;
}

function BasicInfoStep({
  formState,
  onImageChange,
  onTextChange,
}: {
  formState: BasicFormState;
  onImageChange: (file: File) => void;
  onTextChange: (partialState: Partial<BasicFormState>) => void;
}) {
  const title = (
    <h1 className="mt-[18px] text-header2 text-black">그라운드 등록하기</h1>
  );

  const imageUpload = (
    <div className="mt-[18px]">
      <ImageUploadField
        previewUrl={formState.imagePreviewUrl}
        onImageChange={onImageChange}
      />
    </div>
  );

  const fields = (
    <div className="mt-7 flex flex-col gap-5">
      <Textfield
        label="그라운드 명"
        placeholder="예: 은평 롤링탁구장"
        value={formState.title}
        onChange={(event) => onTextChange({ title: event.currentTarget.value })}
      />
      <AddressSearchField
        value={formState.address}
        onSelected={(partialState) => onTextChange(partialState)}
      />
      <SelectField
        label="종목"
        placeholder="종목 선택"
        value={formState.sport}
        options={SPORTS}
        onChange={(sport) => onTextChange({ sport })}
      />
      <SelectField
        label="지역"
        placeholder="지역 선택"
        value={formState.region}
        options={REGIONS}
        onChange={(region) => onTextChange({ region })}
      />
    </div>
  );

  const step = (
    <section aria-labelledby="ground-basic-info-title">
      <span id="ground-basic-info-title" className="sr-only">
        그라운드 기본 정보
      </span>
      {title}
      {imageUpload}
      {fields}
    </section>
  );

  return step;
}

function EnvironmentCard({ group }: { group: EnvironmentGroup }) {
  const items = group.items.map((item) => {
    const checkbox = (
      <input
        type="checkbox"
        readOnly
        checked={item.selected}
        aria-label={item.label}
        className="mt-[3px] size-4 shrink-0 accent-main"
      />
    );

    const label = (
      <span
        className={cn(
          'min-w-0 flex-1 break-keep text-subtitle1',
          item.selected ? 'text-main' : 'text-gray-400',
        )}
      >
        {item.label}
      </span>
    );

    const itemElement = (
      <label key={item.id} className="flex items-start gap-2.5">
        {checkbox}
        {label}
      </label>
    );

    return itemElement;
  });

  const heading = (
    <h2 className="flex items-center gap-2.5 text-header2 text-gray-900">
      <span aria-hidden>{group.icon}</span>
      <span>{group.title}</span>
    </h2>
  );

  const card = (
    <article className="flex h-[197px] flex-col gap-[19px] rounded-[5px] bg-gray-100 px-5 py-5">
      {heading}
      <div className="flex flex-col gap-[19px] px-2.5">{items}</div>
    </article>
  );

  return card;
}

function EnvironmentStep({ stepIndex }: { stepIndex: 1 | 2 }) {
  const groups = environmentSteps[stepIndex - 1];

  const heading = (
    <h1
      id="ground-environment-title"
      aria-label="시설이 가지고 있는 환경을 소개해주세요!"
      className="mt-[30px] text-header2 text-gray-900"
    >
      <span className="block">시설이 가지고 있는 환경을</span>
      <span className="block">소개해주세요!</span>
    </h1>
  );

  const cards = (
    <div className="mt-[25px] flex flex-col gap-[18px]">
      {groups.map((group) => (
        <EnvironmentCard key={group.title} group={group} />
      ))}
    </div>
  );

  const step = (
    <section aria-labelledby="ground-environment-title">
      {heading}
      {cards}
    </section>
  );

  return step;
}

export function GroundRegistrationFunnel() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState(initialBasicForm);
  const canProceedBasic =
    Boolean(formState.imageFile) &&
    formState.title.trim().length > 0 &&
    formState.address.trim().length > 0 &&
    formState.sport.length > 0 &&
    formState.region.length > 0;
  const canProceed = currentStep === 1 ? canProceedBasic : true;

  useEffect(() => {
    return () => {
      if (formState.imagePreviewUrl) {
        URL.revokeObjectURL(formState.imagePreviewUrl);
      }
    };
  }, [formState.imagePreviewUrl]);

  const handleImageChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);

    setFormState((current) => {
      if (current.imagePreviewUrl) {
        URL.revokeObjectURL(current.imagePreviewUrl);
      }

      return { ...current, imageFile: file, imagePreviewUrl: previewUrl };
    });
  };

  const handleTextChange = (partialState: Partial<BasicFormState>) => {
    setFormState((current) => ({ ...current, ...partialState }));
  };

  const handleNext = () => {
    if (!canProceed) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS));
  };

  const progress = (
    <div className="mt-[25px]">
      <StepProgress currentStep={currentStep} />
    </div>
  );

  const content =
    currentStep === 1 ? (
      <BasicInfoStep
        formState={formState}
        onImageChange={handleImageChange}
        onTextChange={handleTextChange}
      />
    ) : (
      <EnvironmentStep stepIndex={currentStep === 2 ? 1 : 2} />
    );

  const navigation = (
    <BottomCTA
      type="button"
      disabled={!canProceed}
      className="shadow-none"
      onClick={handleNext}
    >
      다음
    </BottomCTA>
  );

  const funnel = (
    <main className="mx-auto flex h-dvh w-full max-w-[360px] flex-col overflow-hidden bg-white px-4 pt-6 pb-[100px]">
      {progress}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
        {content}
      </div>
      {navigation}
    </main>
  );

  return funnel;
}
