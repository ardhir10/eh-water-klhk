<?php

namespace App\Exports;

use App\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use DateTime;
use Illuminate\Support\Facades\DB;

class LogsExport implements FromCollection, WithCustomCsvSettings, WithHeadings, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */
    private $date_from;
    private $date_to;
    function __construct($dateFrom, $dateTo)
    {
        $this->date_from = $dateFrom;
        $this->date_to = $dateTo;
    }
    public function collection()
    {$lastData = \App\GlobalSetting::orderBy('id', 'desc')->first();
        $date_froms = $this->date_from . ' ' . '00:00:00';
        $date_tos = $this->date_to . ' ' . '23:59:59';
        $dateSelectAfter = new DateTime($date_tos);
        $dateSelectBefore = new DateTime($date_froms);
        $date_from = $dateSelectBefore->format('Y-m-d H:i:s');
        $date_to = $dateSelectAfter->format('Y-m-d H:i:s');
        $backup =  DB::table('log_reports')->where('tstamp', '>=', $date_from)->where('tstamp', '<=', $date_to)->orderBy('tstamp', 'asc')->get();
        // $backup = Log::select(DB::raw('id,tstamp,ph,tss,amonia,cod, flow_meter,controller_name, (flow_meter/3600)*'.$lastData->db_log_interval))->where('tstamp', '>=', $date_from)->where('tstamp', '<=', $date_to)->get();

        return $backup;
    }
    public function headings(): array
    {
        return ["id", "tstamp", "ph", "tss", "amonia", "cod", "flow_meter", "controller_name"];
    }

    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ';'
        ];
    }
}
