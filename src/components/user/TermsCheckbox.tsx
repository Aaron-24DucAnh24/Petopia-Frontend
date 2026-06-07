'use client';
import { useRef, useState } from 'react';

export function TermsCheckbox() {
  const [hasRead, setHasRead] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setHasRead(true);
    }
  };

  return (
    <div className="col-span-2 flex flex-col space-y-2">
      <label className="text-sm font-medium">Điều khoản và điều kiện</label>
      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-44 overflow-y-auto border border-gray-200 rounded-lg bg-white p-3 text-sm text-gray-700 space-y-3"
      >
        <h3 className="font-bold text-base">Điều khoản sử dụng</h3>

        <h4 className="font-semibold">Nội dung</h4>
        <p>Petopia là một tổ chức về thú cưng vô gia cư và nhận nuôi thú cưng các tổ chức. Tính chính xác và đầy đủ của thông tin hiển thị trong trang web không được đảm bảo dưới bất kỳ hình thức nào. Mặc dù thông tin về Petopia được cập nhật thường xuyên và chúng tôi cố gắng giữ mọi thông tin càng chính xác càng tốt, chúng tôi luôn khuyến nghị gọi cho cơ sở hoặc tổ chức cứu hộ chăm sóc thú cưng để đảm bảo nó vẫn có sẵn. Đó là trách nhiệm duy nhất của bất kỳ người nào xem trang web này để xác minh tính chính xác và đầy đủ của thông tin chứa trong đó trước khi thực hiện bất kỳ hành động nào.</p>

        <h4 className="font-semibold">Danh sách thú cưng và nhận nuôi</h4>
        <p>Tổ chức thành viên Petopia chỉ có thể liệt kê các thú cưng thuộc về tổ chức của họ hoặc là một phần của chương trình hỗ trợ chuyển chỗ ở cho một thành viên của công chúng. Các tổ chức sẽ được yêu cầu loại bỏ bất kỳ vật nuôi nào được liệt kê thay mặt cho người khác.</p>
        <p>Điều quan trọng là bất kỳ thú cưng nào được tìm thấy thông qua dịch vụ nhận con nuôi đều phải được bác sĩ thú y kiểm tra kỹ lưỡng ngay khi nhận nuôi. Chúng tôi không thể đảm bảo sức khỏe hoặc tính khí của bất kỳ động vật nào được cung cấp cho việc áp dụng, chúng tôi cũng không thể đánh giá hay xác nhận một cách toàn diện hoạt động của bất kỳ tổ chức, cá nhân nào.</p>
        <p>Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại hoặc tổn thất nào phát sinh từ việc sử dụng bất kỳ thông tin nào có trên trang web này. Petopia không chịu trách nhiệm về bất kỳ trách nhiệm pháp lý nào đối với bất kỳ thương tích hoặc thiệt hại nào đối với bất kỳ người hoặc tài sản nào gây ra bởi bất kỳ hành vi nào.</p>
        <p>Nếu bạn thấy bất kỳ nội dung nào không phù hợp để xem chung, xin vui lòng thông báo cho chúng tôi.</p>

        <h4 className="font-semibold">Bản quyền</h4>
        <p>Tất cả nội dung trên trang web Petopia được bảo vệ bởi bản quyền thuộc sở hữu của Petopia Ltd. Petopia bảo lưu mọi quyền của mình đối với tất cả nội dung của Petopia và sự cho phép/ủy quyền đối với việc sử dụng/tái tạo nó phải được yêu cầu từ Petopia Ltd trước khi xuất bản bất kỳ tài liệu nào mà Petopia giữ bản quyền.</p>
        <p>Nếu bạn thấy bất kỳ nội dung nào trên trang web này mà bạn nắm giữ quyền bản quyền, vui lòng thông báo cho chúng tôi ngay lập tức và chúng tôi sẽ xóa nó hoặc cung cấp cho bạn tín dụng với sự đồng ý của bạn.</p>

        <h4 className="font-semibold">Đường dẫn</h4>
        <p>Trang web này chứa các liên kết đến các trang web bên ngoài. Petopia không chịu trách nhiệm về sự an toàn/bảo mật của các liên kết này hoặc nội dung của các trang web đó và các liên kết đến các trang web đó cũng không hàm ý bất kỳ sự chứng thực nào về quan điểm được bày tỏ bởi các tổ chức hoặc cá nhân chịu trách nhiệm về họ.</p>

        <h4 className="font-semibold">Logo</h4>
        <p>Không được tải xuống, sao chép và sử dụng logo của Petopia cho bất kỳ mục đích nào mà không có sự cho phép của Petopia. Những người gây quỹ và những người quan tâm đến việc hợp tác với Petopia vui lòng liên hệ với chúng tôi để thảo luận về việc sử dụng logo Petopia.</p>
      </div>
      {!hasRead && (
        <p className="text-xs text-gray-400 italic">Cuộn xuống hết nội dung để xác nhận</p>
      )}
      <div className="flex items-center gap-2">
        <input
          test-id="org-terms-tickbox"
          type="checkbox"
          required
          disabled={!hasRead}
          className="disabled:cursor-not-allowed" />
        <span className={!hasRead ? 'text-gray-400' : ''}>
          Tôi cam kết tuân thủ các điều khoản và điều kiện của tổ chức
        </span>
      </div>
    </div>
  );
}
